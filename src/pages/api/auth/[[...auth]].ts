import { IsAscii, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import type { NextApiResponse } from 'next'
import {
    Body,
    ConflictException,
    createHandler,
    createParamDecorator,
    Get,
    Header,
    HttpException,
    Post,
    Query,
    Res,
    UnauthorizedException,
    ValidationPipe,
} from 'next-api-decorators'

import DiscordOauth2 from 'discord-oauth2'
import { OAuth2Client as GoogleOauth2 } from 'google-auth-library'

import { CookieSerializeOptions } from 'cookie'
import { OAuthType, User } from '../../../types/User'
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

export class LoginRequest {
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(64)
    @IsAscii()
    password!: string
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

export const Cookies = createParamDecorator<Partial<{ [key: string]: string }>>(req => req.cookies)

const SESSION_COOKIE_OPTIONS: CookieSerializeOptions = {
    httpOnly: true,
    sameSite: 'strict',
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

        if (user && user.oauthType) throw new UnauthorizedException('Account is linked to an external provider')

        // Return the same response for invalid email and invalid password to prevent email enumeration
        if (!user || !(await Database.validatePassword(password, user.password)))
            throw new UnauthorizedException('Incorrect email or password')

        // Create user session
        const session = await Database.createSessionFromUser(user)

        // Set the session cookie
        setCookie(res, 'session', session.id, SESSION_COOKIE_OPTIONS)

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

    @Get('/logout')
    public async logout(
        @Header('Next-Router-Prefetch') prefetch: string,
        @Cookies() cookies,
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
        res.setHeader('Refresh', '0; url=' + '/')
        res.end()
    }

    @Get('/providers')
    public getProviderURL() {
        const discord = discordOAuth.generateAuthUrl({
            scope: ['identify', 'email'],
        })

        const google = googleOAuth.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'openid',
            ],
        })

        return {
            discord,
            google,
            github: 'https://github.com',
        }
    }

    @Get('/callback/discord')
    public async discordCallback(@Query('code') code: string, @Res() res: NextApiResponse<User>) {
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

        if (userCreated) {
            // Redirect to the signup completion page
            res.setHeader('Refresh', '0; url=' + '/signup/complete')
            res.end()
        } else {
            // Redirect to dashboard
            res.setHeader('Refresh', '0; url=' + '/dashboard')
            res.end()
        }
    }

    /**
     * TODO https://www.npmjs.com/package/google-auth-library
     */
    @Get('/callback/google')
    public async googleCallback(@Query('code') code: string, @Res() response: NextApiResponse<User>) {
        if (!code) throw new HttpException(400, 'No code provided', ['NO_CODE_PROVIDED'])

        // Get the access token from Google
        try {
            const { tokens } = await googleOAuth.getToken(code)
            googleOAuth.setCredentials(tokens)
        } catch {
            throw new HttpException(401, 'Failed to get access token from Discord', ['INVALID_OAUTH_CODE'])
        }

        // Make a simple request to the People API using our pre-authenticated client
        const url = 'https://people.googleapis.com/v1/people/me?personFields=names,photos'
        const { data } = await googleOAuth.request({ url })
        console.log('Me:', data)

        // After acquiring an access_token, you may want to check on the audience, expiration,
        // or original scopes requested.  You can do that with the `getTokenInfo` method.
        const { email } = await googleOAuth.getTokenInfo(googleOAuth.credentials.access_token)
        console.log('Email:', email)

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

        // Redirect to dashboard
        response.setHeader('Refresh', '0; url=' + '/dashboard')
        response.end()
    }

    /**
     * TODO https://medium.com/@jackrobertscott/easy-github-auth-with-node-js-502d3d8f8e62
     */
    @Get('/callback/github')
    public async githubCallback(@Query('code') code: string, @Res() res: NextApiResponse<User>) {}
}

export default createHandler(AuthHandler)
