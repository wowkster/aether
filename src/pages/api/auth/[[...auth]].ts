import { IsAscii, IsBoolean, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import type { NextApiResponse } from 'next'
import {
    Body,
    ConflictException,
    createHandler,
    Get,
    Header,
    HttpException,
    Post,
    Query,
    Res,
    UnauthorizedException,
    ValidationPipe,
} from 'next-api-decorators'

import { OAuthApp as GitHubOauth2 } from '@octokit/oauth-app'
import DiscordOauth2 from 'discord-oauth2'
import { OAuth2Client as GoogleOauth2 } from 'google-auth-library'

import { OctokitInstance } from '@octokit/oauth-app/dist-types/types'
import { CookieSerializeOptions } from 'cookie'
import { OAuthType, User } from '../../../types/User'
import type { ReqCookies } from '../../../util/auth'
import { Cookies } from '../../../util/auth'
import { setCookie } from '../../../util/cookie'
import Database from '../../../util/database/mongo'

if (!process.env.DISCORD_OAUTH_CLIENT_ID) throw new Error('DISCORD_OAUTH_CLIENT_ID not set in environment')
if (!process.env.DISCORD_OAUTH_CLIENT_SECRET) throw new Error('DISCORD_OAUTH_CLIENT_SECRET not set in environment')
if (!process.env.DISCORD_OAUTH_REDIRECT_URI) throw new Error('DISCORD_OAUTH_REDIRECT_URI not set in environment')

export const discordOAuth = new DiscordOauth2({
    clientId: process.env.DISCORD_OAUTH_CLIENT_ID,
    clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.DISCORD_OAUTH_REDIRECT_URI,
})

if (!process.env.GOOGLE_OAUTH_CLIENT_ID) throw new Error('GOOGLE_OAUTH_CLIENT_ID not set in environment')
if (!process.env.GOOGLE_OAUTH_CLIENT_SECRET) throw new Error('GOOGLE_OAUTH_CLIENT_SECRET not set in environment')
if (!process.env.GOOGLE_OAUTH_REDIRECT_URI) throw new Error('GOOGLE_OAUTH_REDIRECT_URI not set in environment')

const googleOAuth = new GoogleOauth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
)

if (!process.env.GITHUB_OAUTH_CLIENT_ID) throw new Error('GITHUB_OAUTH_CLIENT_ID not set in environment')
if (!process.env.GITHUB_OAUTH_CLIENT_SECRET) throw new Error('GITHUB_OAUTH_CLIENT_SECRET not set in environment')
if (!process.env.GITHUB_OAUTH_REDIRECT_URI) throw new Error('GITHUB_OAUTH_REDIRECT_URI not set in environment')

const githubOAuth = new GitHubOauth2({
    clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
})

export class LoginRequest {
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(64)
    @IsAscii()
    password!: string

    @IsNotEmpty()
    @IsBoolean()
    rememberMe!: boolean
}

export class SignupRequest {
    @IsNotEmpty()
    @MaxLength(64)
    @IsAscii()
    username!: string

    @IsNotEmpty()
    @MaxLength(64)
    @IsAscii()
    firstName!: string

    @IsNotEmpty()
    @MaxLength(64)
    @IsAscii()
    lastName!: string

    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(64)
    @IsAscii()
    password!: string
}

export class SignupCompletionRequest {
    @IsNotEmpty()
    @MaxLength(64)
    @IsAscii()
    firstName!: string

    @IsNotEmpty()
    @MaxLength(64)
    @IsAscii()
    lastName!: string
}

const SESSION_COOKIE_OPTIONS: CookieSerializeOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
}

class AuthHandler {
    /**
     * Logs a user in with username and password
     *
     * Called by the login form
     */
    @Post('/login')
    public async logIn(@Body(ValidationPipe) { email, password }: LoginRequest, @Res() res: NextApiResponse<User>) {
        // Get the user from the database
        const user = await Database.getDbUserFromEmail(email)

        if (user && !user.password) throw new UnauthorizedException('Account is linked to an external provider')

        // Return the same response for invalid email and invalid password to prevent email enumeration
        if (!user || !(await Database.validatePassword(password, user.password)))
            throw new UnauthorizedException('Incorrect email or password')

        // Create user session
        const session = await Database.createSessionFromUser(user)

        // Set the session cookie
        setCookie(res, 'session', session.id, {
            ...SESSION_COOKIE_OPTIONS,
            maxAge: 1000 * 60 * 60 * 24 * (Math.floor(Math.random() * +21) + 7), // Random value between 7-30 days
        })

        return user
    }

    /**
     * Signs up  user from email and password
     *
     * Called by the signup form
     */
    @Post('/signup')
    public async signUp(
        @Body(ValidationPipe) { username, firstName, lastName, email, password }: SignupRequest,
        @Res() res: NextApiResponse<User>
    ) {
        console.log('Sign up request:', { username, firstName, lastName, email, password })

        // Don't allow a new signup if the email is already in use
        if (await Database.getUserFromEmail(email)) throw new ConflictException('Email already in use')

        // Create the user
        const user = await Database.createUserFromSignupRequest({ username, firstName, lastName, email, password })

        // Create user session
        const session = await Database.createSessionFromUser(user)

        // Set the session cookie
        setCookie(res, 'session', session.id, SESSION_COOKIE_OPTIONS)

        return user
    }

    /**
     * Fills in the first & last names if they were not provided by the OAuth provider during signup
     *
     * Called by the signup form
     */
    @Post('/signup/complete')
    public async signUpCompletion(
        @Body(ValidationPipe) { firstName, lastName }: SignupCompletionRequest,
        @Cookies() { session }: ReqCookies
    ) {
        console.log('Sign up completion request:', { firstName, lastName })

        let user = await Database.getUserFromSession(session)

        // Don't allow signup completion if the user already has the fields filled in
        if (user?.firstName && user?.lastName)
            throw new HttpException(409, 'User already has first and last name', ['FIELDS_ALREADY_FILLED'])

        // Update the user
        user = await Database.updateUserCompleteSignup(user.id, { firstName, lastName })

        return user
    }

    /**
     * Revalidate session periodically
     */
    @Post('/session/heartbeat')
    public async revalidate(@Cookies() { session }: ReqCookies) {
        // Get the user from the session
        const user = await Database.getUserFromSession(session)

        // If the user is not found, discard the request
        if (!user) return { valid: false }

        // If the user is found, we need to revalidate the session
        const updatedSession = await Database.updateSessionDate(session)

        return { valid: true, expires: new Date(updatedSession.expireAfter.getTime() + 3600 * 1000) }
    }

    /**
     * Logs a user out
     * Called by the logout button
     */
    @Get('/logout')
    public async logout(
        @Header('Next-Router-Prefetch') prefetch: string,
        @Cookies() cookies: ReqCookies,
        @Res() res: NextApiResponse<User>
    ) {
        // Don't log users out when next prefetches the logout link
        if (prefetch) return

        const { session } = cookies

        // Unset the session cookie
        setCookie(res, 'session', null, {
            maxAge: -1,
            ...SESSION_COOKIE_OPTIONS,
        })

        // Log the user being logged out
        const user = await Database.getUserFromSession(session)

        if (!user) return res.redirect('/')

        console.log('Logging out user:', user.username)

        // Destroy the session
        await Database.destroySession(session)

        // Redirect to home page
        res.setHeader('Refresh', '0; url=/')
        res.end()
    }

    @Get('/providers')
    public getProviderURL(@Query('redirect') redirect: string) {
        const state = redirect ? Buffer.from(JSON.stringify({ redirect })).toString('base64') : undefined

        const discord = discordOAuth.generateAuthUrl({
            scope: ['identify', 'email'],
            state,
        })

        const google = googleOAuth.generateAuthUrl({
            // eslint-disable-next-line camelcase
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'openid',
            ],
            state,
        })

        const { url: github } = githubOAuth.getWebFlowAuthorizationUrl({
            scopes: ['user:email', 'read:user'],
            state,
        })

        return {
            discord,
            google,
            github,
        }
    }

    private static parseState(state: string | null) {
        // Extract the redirect url from the state if it exits
        try {
            return JSON.parse(Buffer.from(state, 'base64').toString('utf-8')).redirect
        } catch {
            return null
        }
    }

    @Get('/callback/discord')
    public async discordCallback(
        @Query('code') code: string,
        @Query('state') state: string | null,
        @Res() res: NextApiResponse<User>
    ) {
        if (!code) throw new HttpException(400, 'No code provided', ['NO_CODE_PROVIDED'])

        let discordToken: DiscordOauth2.TokenRequestResult

        try {
            discordToken = await discordOAuth.tokenRequest({
                scope: ['identify', 'email'],
                code,
                grantType: 'authorization_code',
            })
        } catch {
            throw new HttpException(401, 'Failed to get access token from Discord', ['INVALID_OAUTH_CODE'])
        }

        if (!discordToken?.access_token)
            throw new HttpException(401, 'Failed to get access token from Discord', [
                'INVALID_AUTH_TOKEN_FROM_PROVIDER',
            ])

        const discordUser = await discordOAuth.getUser(discordToken?.access_token)

        if (!discordUser?.email)
            throw new HttpException(401, 'Failed to get email from Discord', ['INVALID_EMAIL_FROM_PROVIDER'])
        if (!discordUser?.id)
            throw new HttpException(401, 'Failed to get user ID from Discord', ['INVALID_EMAIL_FROM_PROVIDER'])

        // Get the user from the database
        let user: User = await Database.getUserFromEmail(discordUser.email)

        // If user did not use Discord to sign up, throw an error
        if (user && user.oauthType !== OAuthType.DISCORD)
            throw new HttpException(401, 'User did not use Discord to sign up', ['WRONG_OAUTH_PROVIDER'])

        let userCreated = false

        // Create the user if they don't exist
        if (!user) {
            user = await Database.createUserFromDiscordOAuth(discordUser)
            userCreated = true
        }

        // Create user session
        const session = await Database.createSessionFromUser(user)

        // Set the session cookie
        setCookie(res, 'session', session.id, SESSION_COOKIE_OPTIONS)

        // Extract the redirect url from the state if it exits
        const redirect = AuthHandler.parseState(state)
        const redirectQuery = redirect ? `?redirect=${redirect}` : ''

        if (userCreated) {
            // Redirect to the signup completion page
            res.setHeader('Refresh', `0; url=/signup/complete${redirectQuery}`)
            res.end()
        } else {
            // Redirect to dashboard
            res.setHeader('Refresh', `0; url=/dashboard${redirectQuery}`)
            res.end()
        }
    }

    @Get('/callback/google')
    public async googleCallback(
        @Query('code') code: string,
        @Query('state') state: string | null,
        @Res() response: NextApiResponse<User>
    ) {
        if (!code) throw new HttpException(400, 'No code provided', ['NO_CODE_PROVIDED'])

        // Get the access token from Google
        try {
            const { tokens } = await googleOAuth.getToken(code)
            googleOAuth.setCredentials(tokens)
        } catch {
            throw new HttpException(401, 'Failed to get access token from Google', ['INVALID_OAUTH_CODE'])
        }

        // Make a simple request to the People API using our pre-authenticated client
        const url = 'https://people.googleapis.com/v1/people/me?personFields=names,photos'
        const { data } = await googleOAuth.request({ url })

        // After acquiring an access_token, you may want to check on the audience, expiration,
        // or original scopes requested.  You can do that with the `getTokenInfo` method.
        const { email } = await googleOAuth.getTokenInfo(googleOAuth.credentials.access_token)

        // Get the user from the database
        let user: User = await Database.getUserFromEmail(email)

        // If user did not use Google to sign up, throw an error
        if (user && user.oauthType !== OAuthType.GOOGLE)
            throw new HttpException(401, 'User did not use Google to sign up', ['WRONG_OAUTH_PROVIDER'])

        // Create the user if they don't exist
        if (!user) user = await Database.createUserFromGoogleOAuth(data, email)

        // Create user session
        const session = await Database.createSessionFromUser(user)

        // Set the session cookie
        setCookie(response, 'session', session.id, SESSION_COOKIE_OPTIONS)

        // Extract the redirect url from the state if it exits
        const redirect = AuthHandler.parseState(state)
        const redirectQuery = redirect ? `?redirect=${redirect}` : ''

        // Redirect to dashboard
        response.setHeader('Refresh', `0; url=/dashboard${redirectQuery}`)
        response.end()
    }

    // TODO make an enum for errors and include it in the query string of a login page redirect

    @Get('/callback/github')
    public async githubCallback(
        @Query('code') code: string,
        @Query('state') state: string | null,
        @Res() res: NextApiResponse<User>
    ) {
        if (!code) throw new HttpException(400, 'No code provided', ['NO_CODE_PROVIDED'])

        let octokit: OctokitInstance

        try {
            // Create an octokit instance from the token
            octokit = await githubOAuth.getUserOctokit({ code })
        } catch {
            throw new HttpException(401, 'Failed to get access token from GitHub', ['INVALID_OAUTH_CODE'])
        }

        // Get the user object from GitHub
        const userSupplier = () => octokit.request('GET /user')

        let githubUser: Awaited<ReturnType<typeof userSupplier>>['data']

        try {
            const { data } = await userSupplier()
            githubUser = data
        } catch {
            throw new HttpException(401, 'Failed to get profile data from GitHub', ['INVALID_DATA_FROM_PROVIDER'])
        }

        // Get the user's emails from GitHub
        const emailSupplier = () => octokit.request('GET /user/emails')

        let emails: Awaited<ReturnType<typeof emailSupplier>>['data']

        try {
            const { data } = await emailSupplier()
            emails = data
        } catch {
            throw new HttpException(401, 'Failed to get emails from GitHub', ['INVALID_DATA_FROM_PROVIDER'])
        }

        // Get the user's primary email
        const primaryEmail = emails.find(email => email.primary)?.email

        // Get the user from the database
        let user: User = await Database.getUserFromEmail(primaryEmail)

        // If user did not use GitHub to sign up, throw an error
        if (user && user.oauthType !== OAuthType.GITHUB)
            throw new HttpException(401, 'User did not use GitHub to sign up', ['WRONG_OAUTH_PROVIDER'])

        let userCreated = false

        // Create the user if they don't exist
        if (!user) {
            user = await Database.createUserFromGitHubOAuth({
                username: githubUser.login,
                avatarURL: githubUser.avatar_url,
                email: primaryEmail,
            })
            userCreated = true
        }

        // Create user session
        const session = await Database.createSessionFromUser(user)

        // Set the session cookie
        setCookie(res, 'session', session.id, SESSION_COOKIE_OPTIONS)

        // Extract the redirect url from the state if it exits
        const redirect = AuthHandler.parseState(state)
        const redirectQuery = redirect ? `?redirect=${redirect}` : ''

        if (userCreated) {
            // Redirect to the signup completion page
            res.setHeader('Refresh', `0; url=/signup/complete${redirectQuery}`)
            res.end()
        } else {
            // Redirect to dashboard
            res.setHeader('Refresh', `0; url=/dashboard${redirectQuery}`)
            res.end()
        }
    }
}

export default createHandler(AuthHandler)
