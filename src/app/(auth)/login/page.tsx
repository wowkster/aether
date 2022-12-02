import Link from 'next/link'

import OAuthProviders from '../OAuthProviders'
import LoginForm from './LoginForm'

import styles from '../auth.module.scss'
import { validateSession } from '../session'

const Login = async props => {
    // Request will be redirected if the user is already logged in
    await validateSession(props.searchParams.redirect)

    return (
        <div className={styles.wrapper}>
            <div className={styles.text}>
                <h1 className={styles.title}>Log In</h1>
            </div>
            <LoginForm />
            <p className={styles.or}>OR</p>
            {/* @ts-expect-error Server Component */}
            <OAuthProviders />
            <hr className={styles.rule} />
            <div className={styles.auth_links}>
                <Link href={'/forgot'}>Can&apos;t log in?</Link>
                &nbsp; &bull; &nbsp;
                <Link href={'/signup'}>Sign Up</Link>
            </div>
        </div>
    )
}

export default Login
