import Link from 'next/link'
import { FC } from 'react'

import JoinForm from './JoinForm'
import styles from './NoOrganization.module.scss'

const NoOrganization: FC = () => {
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.heading}>You are not a part of an organization!</h2>
            <p className={styles.subheading}>
                If you are a team member, ask to be invited via email or paste a join code below:
            </p>
            <JoinForm />
            <span className={styles.small}>
                If you are the scouting leader for your team,{' '}
                <Link href='/dashboard/create_organization'>Create an Organization</Link> instead.
            </span>
        </div>
    )
}

export default NoOrganization
