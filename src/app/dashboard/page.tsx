import { redirect } from 'next/navigation'
import { getSession } from '../../util/session'
import NoOrganization from './(no_organization)/NoOrganization'

export default async function Dashboard() {
    const { user, organizations, selectedOrganization } = await getSession()

    // If the user is a part of an organization, redirect to that organization
    if (selectedOrganization) {
        redirect(`/dashboard/orgs/${selectedOrganization.id}`)
    }

    // Render the screen that accepts a join code
    return <NoOrganization />
}
