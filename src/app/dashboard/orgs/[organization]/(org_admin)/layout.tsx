import { redirect } from 'next/navigation'
import { Role } from '../../../../../types/Organization'
import { getSession } from '../../../../../util/session'

export default async function OrgAdminLayout(props) {
    const { user, selectedOrganization } = await getSession()

    // Redirect don't allow user to visit page if they do not have permission to access the organization admin section
    const { role } = selectedOrganization.members.find(m => m.id === user.id)

    if (!(role === Role.OWNER || role === Role.ADMINISTRATOR)) {
        redirect(`/dashboard/orgs/${selectedOrganization.id}`)
    }

    // Pass straight through to the page
    return <>{props.children}</>
}
