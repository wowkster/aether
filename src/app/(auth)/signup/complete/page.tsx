import styles from '../../auth.module.scss'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Database from '../../../../util/database/mongo'
import SignupCompletionForm from './SignupCompletionForm'

const validateSessionAndLoginState = async (redirectURL?: string) => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')

    // TODO make into an api route to auto dedupe requests to database (save money)
    const user = await Database.getUserFromSession(session?.value)

    // If there is a user session, redirect away from the sign up page
    if (!user) {
        console.log('User session does not exist, redirecting to login')
        redirect(`/login${redirectURL ? `?redirect=${redirectURL}` : ''}`)
    }

    // If there is a user session, redirect away from the sign up page
    if (user.firstName && user.lastName) {
        console.log('User session exists, but names were found, redirecting to dashboard')
        redirect(`/dashboard${redirectURL ? `?redirect=${redirectURL}` : ''}`)
    }
}

/**
 * This page is shown after an OAuth signup, if the first and
 * last name can not be inferred from the OAuth provider
 */
const SignupCompletion = async props => {
    // Request will be redirected if this page is not necessary
    await validateSessionAndLoginState(props.searchParams.redirect)

    return (
        <div className={styles.wrapper}>
            <div className={styles.text}>
                <h1 className={styles.title}>Sign Up Completion</h1>
            </div>
            <SignupCompletionForm redirect={props.searchParams.redirect}/>
        </div>
    )
}

export default SignupCompletion
