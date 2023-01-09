import { Organization } from '../../types/Organization'
import { User } from '../../types/User'

export interface RightSideBarProps {
    user: User
    organizations: Organization[]
    selectedOrganization: Organization
}

export default async function RightSideBar({ user, organizations, selectedOrganization }: RightSideBarProps) {
    return <>Your mom</>
}
