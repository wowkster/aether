import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import OAuthProviders from '../OAuthProviders'
import LoginForm from './LoginForm'

import styles from '../auth.module.scss'
import Database from '../../../util/database/mongo'

const checkSessionState = async (redirectPath: string | string[]) => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')

    const user = await Database.getUserFromSession(session?.value)

    console.log('Session User (Login):', user)

    // Get path from param or first instance of that param if array
    const path = redirectPath ? (typeof redirectPath === 'string' ? redirectPath : redirectPath[0]) : '/dashboard'

    // If there is a user session, redirect away from the sign up page
    if (user) {
        console.log('User session exists, redirecting from Log In to', path)
        redirect(path)
    }
}

const Login = async props => {
    // Request will be redirected if the user is already logged in
    await checkSessionState(props.searchParams.redirect)

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
