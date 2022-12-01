import './globals.scss'
import './fonts.scss'

import ReactQueryProvider from './ReactQueryProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head />
            <body>
                <ReactQueryProvider>{children}</ReactQueryProvider>
            </body>
        </html>
    )
}

