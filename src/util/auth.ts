import { NextApiRequest, NextApiResponse } from 'next'
import { createMiddlewareDecorator, createParamDecorator, UnauthorizedException } from 'next-api-decorators'
import type { User } from '../types/User'
import Database from './database/mongo'

declare module 'next' {
    interface NextApiRequest {
        user: User
    }
}

export const RequireAuthSession = createMiddlewareDecorator(async (req: NextApiRequest, res: NextApiResponse) => {
    let session = req.cookies['session']

    const user = await Database.getUserFromSession(session)

    if (!user) {
        throw new UnauthorizedException()
    }

    req.user = user
})

export type ReqCookies = Partial<{ [key: string]: string }>
export const Cookies = createParamDecorator<ReqCookies>(req => req.cookies)

export const UserSession = createParamDecorator<User>(req => req.user)