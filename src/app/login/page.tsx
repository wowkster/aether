import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'

import { FaUsers } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/md'
import { AiOutlineFundView } from 'react-icons/ai'

import theme from '../../styles/theme.module.scss'
import styles from './login.module.scss'

const checkLoginState = async (redirectPath: string | string[]) => {
    const nextCookies = cookies()
    const loggedIn = nextCookies.get('logged_in')

    // Get path from param or first instance of that param if array
    const path = redirectPath ? (typeof redirectPath === 'string' ? redirectPath : redirectPath[0]) : '/'

    if (loggedIn?.value === 'true') redirect(path)
}

const Login = async ({ searchParams }) => {
    // Request will be redirected if the user is already logged in
    await checkLoginState(searchParams.redirect)

    return (
        <div className={styles.wrapper}>
            <div className={styles.text}>
                <h1 className={styles.title}>Log In</h1>
                {/* <p className={styles.description}>Choose a login option below</p> */}
            </div>
            <div className={styles.button_group}>
                <LoginLink
                    href={'/login/viewer'}
                    icon={<AiOutlineFundView size={48} color={theme.green} />}
                    title='Viewer Login'
                    description='For non-scout members to view scouting data and analytics'
                />
                <LoginLink
                    href={'/login/scout'}
                    icon={<FaUsers size={48} color={theme.blue} />}
                    title='Scout Login'
                    description='For team members complete their scouting and receive updates'
                />
                <LoginLink
                    href={'/login/admin'}
                    icon={<MdAdminPanelSettings size={48} color={theme.red} />}
                    title='Administrator Login'
                    description='For team administrators to manage the scouting session'
                />
            </div>
            <hr className={styles.rule} />
            <div className={styles.links}>
                <Link href={'/privacy'}>Can&apos;t log in?</Link>
                &nbsp; &bull; &nbsp;
                <Link href={'/signup'}>Sign Up</Link>
            </div>
        </div>
    )
}

const LoginLink: FC<{
    href: string
    icon: React.ReactNode
    title: React.ReactNode
    description: React.ReactNode
}> = ({ href, icon, title, description }) => {
    return (
        <Link href={href} className={styles.login_link}>
            {icon}
            <div className={styles.text}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </Link>
    )
}

export default Login
