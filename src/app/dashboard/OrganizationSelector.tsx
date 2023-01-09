import { FC } from 'react'
import { Organization } from '../../types/Organization'

export interface OrganizationSelectorProps {
    organizations: Organization[]
    selectedOrganization: Organization | null
}

const OrganizationSelector: FC<OrganizationSelectorProps> = ({ organizations, selectedOrganization }) => {
    return (
        <>
            <label htmlFor='organization-selector'>Organization</label>
            <select id='organization-selector'>
                {organizations.map(org => (
                    <option value={org.id}>{org.name}</option>
                ))}
            </select>
        </>
    )
}

export default OrganizationSelector
