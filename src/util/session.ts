import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Database from './database/mongo'

export const getSession = async () => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')

    const user = await Database.getUserFromSession(session?.value)

    // If there is not a user session, redirect away from the sign up page
    if (!user) redirect('/login?redirect=/dashboard')

    const organizations = await Database.getUserOrganizations(user.id)

    const org = nextCookies.get('organization')
    // Select the organization from the cookie, or the first organization in the list
    const selectedOrganization = org ? await Database.getOrganizationFromId(org?.value) : organizations[0] ?? null

    return { user, organizations, selectedOrganization }
}
