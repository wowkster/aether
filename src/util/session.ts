import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Database from './database/mongo'

export const getSession = async (params?: any) => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')

    const user = await Database.getUserFromSession(session?.value)

    // If there is not a user session, redirect away from the sign up page
    if (!user) redirect('/login?redirect=/dashboard')

    const organizations = await Database.getUserOrganizations(user.id)

    const org = params?.organization ?? nextCookies.get('organization')
    // Select the organization from the cookie, or the first organization in the list
    const selectedOrganization = org ? await Database.getOrganizationFromId(org?.value) : organizations[0] ?? null

    // User's cookie represents an organization that they are not a part of or does not exist
    if (org && !selectedOrganization?.members.some(m => m.id === user.id)) {
        // Redirect the user to api route which will reset their `organization`
        // cookie and redirect them to the /dashboard route
        redirect(`/api/orgs/reset_org_cookie`)
    }

    return {
        user,
        organizations,
        selectedOrganization,
    }
}
