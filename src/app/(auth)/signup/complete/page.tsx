import styles from '../../auth.module.scss'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import Database from '../../../../util/database/mongo'
import SignupCompletionForm from './SignupCompletionForm'

const validateSessionAndLoginState = async () => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')
    
    // TODO make into an api route to auto dedupe requests to database (save money)
    const user = await Database.getUserFromSession(session?.value)

    // If there is a user session, redirect away from the sign up page
    if (!user) {
        console.log('User session does not exist, redirecting to login')
        redirect('/login')
    }

    // If there is a user session, redirect away from the sign up page
    if (user.firstName && user.lastName) {
        console.log('User session exists, but names were found, redirecting to dashboard')
        redirect('/dashboard')
    }
}

/**
 * This page is shown after an OAuth signup, if the first and
 * last name can not be inferred from the OAuth provider
 */
const SignupCompletion = async props => {
    // Request will be redirected if this page is not necessary
    await validateSessionAndLoginState()

    return (
        <div className={styles.wrapper}>
            <div className={styles.text}>
                <h1 className={styles.title}>Sign Up Completion</h1>
            </div>
            <SignupCompletionForm />
        </div>
    )
}

export default SignupCompletion
