import Link from 'next/link'

import OAuthProviders from '../OAuthProviders'
import SignupForm from './SignupForm'

import styles from '../auth.module.scss'
import { validateSession } from '../session'

const Signup = async props => {
    // Request will be redirected if the user is already logged in
    await validateSession(props.searchParams.redirect)

    return (
        <div className={styles.wrapper}>
            <div className={styles.text}>
                <h1 className={styles.title}>Sign Up</h1>
            </div>
            <SignupForm />
            <p className={styles.or}>OR</p>
            {/* @ts-expect-error Server Component */}
            <OAuthProviders redirect={props.searchParams.redirect} />
            <hr className={styles.rule} />
            <div className={styles.auth_links}>
                <Link href={'/about'}>What is Aether?</Link>
                &nbsp; &bull; &nbsp;
                <Link href={'/login'}>Log In</Link>
            </div>
        </div>
    )
}

export default Signup
