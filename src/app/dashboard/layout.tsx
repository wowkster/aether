import Image from 'next/image'
import Link from 'next/link'

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from 'react-icons/tb'

import Nav from './Nav'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import logoDark from '../../../public/img/logo-beta-dark.svg'
import logo from '../../../public/img/logo-beta.svg'
import Database from '../../util/database/mongo'
import { combine } from '../../util/styles'
import styles from './layout.module.scss'

const getSession = async () => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')

    const user = await Database.getUserFromSession(session?.value)

    console.log('Session User (Dashboard):', user)

    // If there is a user session, redirect away from the sign up page
    if (!user) redirect('/login?redirect=/dashboard')

    return { user }
}

export default async function Layout(props) {
    const { user } = await getSession()

    const organizations = await Database.getUserOrganizations(user.id)

    console.log('Organizations:', organizations)

    return (
        <>
            <input
                type='checkbox'
                name='left-sidebar-input'
                id='left-sidebar-input'
                className={styles.left_nav_input}
            />
            <div className={combine(styles.container, 'theme-dark')} id='page-container'>
                <aside className={styles.side_bar} id='left-sidebar'>
                    <Link href='/' className={styles.logo_container}>
                        <Image src={logo} alt={'Aether logo'} className={styles.logo} />
                        <Image src={logoDark} alt={'Aether logo'} className={combine(styles.logo, styles.logo_dark)} />
                    </Link>
                    <Nav />
                    {/* One label for when its open, and one for when its closed (conditionally styled instead of using client js) */}
                    <label className={combine(styles.collapse, styles.collapse_close)} htmlFor='left-sidebar-input'>
                        <TbLayoutSidebarLeftCollapse size={26} />
                    </label>
                    <label className={combine(styles.collapse, styles.collapse_open)} htmlFor='left-sidebar-input'>
                        <TbLayoutSidebarLeftExpand size={26} />
                    </label>
                </aside>
                <div className={styles.page_content} id='page-content'>
                    <main>{props.children}</main>
                    <footer className={styles.footer}>&copy; 2022 Wowkster. All rights reserved.</footer>
                </div>
                <aside className={styles.side_bar}>
                    {/* <h1>Your Name</h1>
                    <h2>Administrator</h2> */}
                </aside>
            </div>
        </>
    )
}
