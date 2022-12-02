import Image from 'next/image'
import Link from 'next/link'

import logo from '../../../public/img/logo-beta.svg'
import { combine } from '../../util/styles'

import styles from './NavBar.module.scss'

export default function NavBar() {
    return (
        <div className={styles.nav_wrapper}>
            <nav className={styles.nav}>
                <div className={styles.nav__side}>
                    <Link href='/'>
                        <Image src={logo} alt={'Aether logo'} className={styles.logo} height={36} />
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
                    <Link href={'/login'} className={combine(styles.nav__button, styles.nav__button__primary)}>
                        Login
                    </Link>
                    <Link href={'/signup'} className={combine(styles.nav__button, styles.nav__button__secondary)}>
                        Sign Up
                    </Link>
                </div>
            </nav>
        </div>
    )
}
