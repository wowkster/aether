import Image from 'next/image'
import Link from 'next/link'

import logo from '../../../public/logo-beta.svg'

import styles from './login.layout.module.scss'

export default async function LoginLayout({ children }) {
    return (
        <div className={styles.page_container}>
            <main className={styles.main}>
                <Image src={logo} alt={'Aether logo'} className={styles.logo} height={64} />
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
