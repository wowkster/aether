import { FC } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import Image from 'next/image'

import { Organization } from '../../types/Organization'
import { combine } from '../../util/styles'

import styles from './OrganizationSelector.module.scss'

export interface OrganizationSelectorProps {
    organizations: Organization[]
    selectedOrganization: Organization | null
}

const OrganizationSelector: FC<OrganizationSelectorProps> = ({
    organizations: _organizations,
    selectedOrganization,
}) => {
    return (
        <div className={styles.wrapper}>
            <label htmlFor='organization-selector' className={styles.label}>
                Organization
            </label>
            {/* TODO: Implement custom select dropdown and make accessible */}
            {selectedOrganization ? (
                <div id='organization-selector' className={combine(styles.select, styles.select_real)}>
                    <div className={styles.select_real_avatar}>
                        <Image
                            src={`https://aether.localhost:9000/aether/avatars/${selectedOrganization.id}/${selectedOrganization.avatar}.webp`}
                            alt={`Team ${selectedOrganization.teamNumber} Avatar`}
                            width={24}
                            height={24}
                        />
                        <span>@{selectedOrganization.tag}</span>
                    </div>
                    <BiChevronDown size={24} />
                </div>
            ) : (
                <div className={combine(styles.select, styles.select_fake)}>
                    <span>None</span>
                    <BiChevronDown size={24} />
                </div>
            )}
        </div>
    )
}

export default OrganizationSelector
