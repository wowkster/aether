import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import logo from '../../../public/img/logo-beta.svg'
import logoDark from '../../../public/img/logo-beta-dark.svg'
import { User } from '../../types/User'
import Database from '../../util/database/mongo'
import { combine } from '../../util/styles'

import styles from './NavBar.module.scss'

const getUser = (): Promise<User | null> => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')

    return Database.getUserFromSession(session?.value)
}

export default async function NavBar() {
    const user = await getUser()

    return (
        <div className={styles.nav_wrapper}>
            <nav className={styles.nav}>
                <div className={styles.nav__side}>
                    <Link href='/'>
                        <Image src={logo} alt={'Aether logo'} className={styles.logo} height={36} />
                        <Image src={logoDark} alt={'Aether logo'} className={combine(styles.logo, styles.logo_dark)} height={36} />
                    </Link>
                    <div className={styles.nav__links}>
                        <Link href={'#'}>Features</Link>
                        <Link href={'#'}>Docs</Link>
                        <Link href={'#'}>Blog</Link>
                        <Link href={'#'}>Discord</Link>
                        <Link href={'#'}>GitHub</Link>
                    </div>
                </div>
                <div className={styles.nav__side}>
                    {user ? (
                        <>
                            <div className={styles.profile}>
                                <Image
                                    src={`https://aether.localhost:9000/aether/avatars/${user.id}/${user.avatar}.webp`}
                                    alt={'User avatar'}
                                    className={styles.profile__avatar}
                                    width={36}
                                    height={36}
                                />
                                <span className={styles.profile__name}>Hello, {user.username}</span>
                            </div>
                            <Link
                                href={'/dashboard'}
                                className={combine(styles.nav__button, styles.nav__button__primary)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={'/api/auth/logout'}
                                className={combine(styles.nav__button, styles.nav__button__danger)}
                            >
                                Log Out
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={'/login'} className={combine(styles.nav__button, styles.nav__button__primary)}>
                                Login
                            </Link>
                            <Link
                                href={'/signup'}
                                className={combine(styles.nav__button, styles.nav__button__secondary)}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    )
}
