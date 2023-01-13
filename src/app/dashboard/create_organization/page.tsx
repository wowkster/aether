import CreateOrganizationForm from './CreateOrganizationForm'

import styles from './page.module.scss'

export default function CreateOrganizationPage() {
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.heading}>Create an Organization</h2>
            <p className={styles.subheading}>
                An organization represents an entire FRC team and all of its administrators, scouts, and other members.
            </p>
            <CreateOrganizationForm />
        </div>
    )
}
