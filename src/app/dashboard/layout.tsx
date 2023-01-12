import Image from 'next/image'
import Link from 'next/link'

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from 'react-icons/tb'

import Nav from './Nav'

import logoDark from '../../../public/img/logo-beta-dark.svg'
import logo from '../../../public/img/logo-beta.svg'
import { combine } from '../../util/styles'
import styles from './layout.module.scss'
import { getSession } from '../../util/session'
import RightSideBar from './RightSideBar'

export default async function Layout(props) {
    const session = await getSession(props.params)

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
                    {/* @ts-expect-error Server Component */}
                    <Nav {...session} />
                    {/* One label for when its open, and one for when its closed (conditionally styled instead of using client js) */}
                    <label className={combine(styles.collapse, styles.collapse_close)} htmlFor='left-sidebar-input'>
                        <TbLayoutSidebarLeftCollapse size={26} />
                    </label>
                    <label className={combine(styles.collapse, styles.collapse_open)} htmlFor='left-sidebar-input'>
                        <TbLayoutSidebarLeftExpand size={26} />
                    </label>
                </aside>
                <div className={styles.page_content} id='page-content'>
                    <div className={styles.page_content_wrapper}>
                        <main className={styles.main}>{props.children}</main>
                        <footer className={styles.footer}>&copy; 2022 Wowkster. All rights reserved.</footer>
                    </div>
                </div>
                <aside className={styles.side_bar}>
                    {/* @ts-expect-error Server Component */}
                    <RightSideBar {...session} />
                </aside>
            </div>
        </>
    )
}
