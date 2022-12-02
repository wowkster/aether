import './globals.scss'
import './fonts.scss'

import ReactQueryProvider from './ReactQueryProvider'
import SessionHeartbeat from './SessionHeartbeat'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head />
            <body>
                <ReactQueryProvider>{children}</ReactQueryProvider>
                <SessionHeartbeat />
            </body>
        </html>
    )
}
