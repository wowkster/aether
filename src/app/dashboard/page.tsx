import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Database from '../../util/database/mongo'

const getSession = async () => {
    const nextCookies = cookies()
    const session = nextCookies.get('session')

    const user = await Database.getUserFromSession(session?.value)

    console.log('Session User (Dashboard):', user)

    // If there is a user session, redirect away from the sign up page
    if (!user) redirect('/login?redirect=/dashboard')

    return { user }
}

export default async function Dashboard() {
    const { user } = await getSession()

    return (
        <>
            <h1>Dashboard</h1>
            <pre>{JSON.stringify(user, null, 4)}</pre>
            <Link href='/api/auth/logout' prefetch={false}>
                Log Out
            </Link>
        </>
    )
}
