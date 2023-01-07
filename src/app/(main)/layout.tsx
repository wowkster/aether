import NavBar from './NavBar'

import styles from './main.layout.module.scss'

export default function Layout({ children }) {
    return (
        <div className={styles.page_container}>
            {/* @ts-expect-error Server Component */}
            <NavBar />
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <hr className={styles.rule} />
                <span>&copy; 2022 Team 303 Aether</span>
            </footer>
        </div>
    )
}
