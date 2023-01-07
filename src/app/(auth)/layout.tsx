import Image from 'next/image'
import Link from 'next/link'

import logo from '../../../public/img/logo-beta.svg'
import logoDark from '../../../public/img/logo-beta-dark.svg'

import styles from './auth.layout.module.scss'
import { combine } from '../../util/styles'

export default function LoginLayout({ children }) {
    return (
        <div className={styles.page_container}>
            <main className={styles.main}>
                <Link href='/'>
                    <Image src={logo} alt={'Aether logo'} className={styles.logo} height={64} />
                    <Image src={logoDark} alt={'Aether logo'} className={combine(styles.logo, styles.logo_dark)} height={64} />
                </Link>
                <div className={styles.wrapper}>{children}</div>
                <div className={styles.links}>
                    <Link href={'/privacy'}>Privacy Policy</Link>
                    <span>&nbsp; &bull; &nbsp;</span>
                    <Link href={'/terms'}>Terms of Service</Link>
                </div>
            </main>
            <footer className={styles.footer}>
                <hr className={styles.rule} />
                <span>&copy; 2022 Team 303 Aether</span>
            </footer>
        </div>
    )
}
