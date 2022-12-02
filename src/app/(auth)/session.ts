import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import Database from '../../util/database/mongo'

export const validateSession = async (redirectPath?: string | string[]) => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')

    const user = await Database.getUserFromSession(session?.value)

    console.log('Session User:', user)

    // Get path from param or first instance of that param if array
    const path = redirectPath ? (typeof redirectPath === 'string' ? redirectPath : redirectPath[0]) : '/dashboard'

    // If there is a user session, redirect away
    if (user) {
        console.log('User session exists, redirecting to', path)
        redirect(path)
    }
}