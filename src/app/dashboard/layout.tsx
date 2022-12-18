import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from 'react-icons/tb'

import Nav from './Nav'

import logo from '../../../public/img/logo-beta.svg'
import logoDark from '../../../public/img/logo-beta-dark.svg'
import styles from './layout.module.scss'
import { combine } from '../../util/styles'

interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
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
                    <main>{children}</main>
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
