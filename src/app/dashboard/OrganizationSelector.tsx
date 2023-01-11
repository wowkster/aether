import { FC } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { Organization } from '../../types/Organization'

import styles from './OrganizationSelector.module.scss'

export interface OrganizationSelectorProps {
    organizations: Organization[]
    selectedOrganization: Organization | null
}

const OrganizationSelector: FC<OrganizationSelectorProps> = ({ organizations, selectedOrganization }) => {
    if (!selectedOrganization) {
        return (
            <div className={styles.none}>
                <label className={styles.none_label}>Organization</label>
                <div className={styles.none_select}>
                    <span>None</span>
                    <BiChevronDown size={24} />
                </div>
            </div>
        )
    }

    return (
        <>
            <label htmlFor='organization-selector'>Organization</label>
            <select id='organization-selector'>
                {organizations.map(org => (
                    <option value={org.id} key={org.id}>
                        {org.name}
                    </option>
                ))}
            </select>
        </>
    )
}

export default OrganizationSelector
