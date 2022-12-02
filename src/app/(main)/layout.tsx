import NavBar from './NavBar'

import styles from './main.layout.module.scss'

export default async function Layout({ children }) {
    return (
        <div className={styles.page_container}>
            <NavBar />
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <hr className={styles.rule} />
                <span>&copy; 2022 Team 303 Aether</span>
            </footer>
        </div>
    )
}
