import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getSession } from '../../../util/session'
import JoinForm from './JoinForm'

import styles from './page.module.scss'

export default async function Dashboard() {
    const { selectedOrganization } = await getSession()

    // If the user is a part of an organization, redirect to that organization
    if (selectedOrganization) {
        redirect(`/dashboard/orgs/${selectedOrganization.id}`)
    }

    // Render the screen that accepts a join code
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
