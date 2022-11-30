import './globals.scss'

import Metropolis from '@next/font/local'

const metropolis = Metropolis({
    src: [
        { path: '../../public/fonts/metropolis/Metropolis-Black.otf', weight: '900' },
        { path: '../../public/fonts/metropolis/Metropolis-Black-Italic.otf', weight: '900', style: 'italic' },
        { path: '../../public/fonts/metropolis/Metropolis-Bold.otf', weight: '700' },
        { path: '../../public/fonts/metropolis/Metropolis-Bold-Italic.otf', weight: '700', style: 'italic' },
        { path: '../../public/fonts/metropolis/Metropolis-ExtraBold.otf', weight: '800' },
        { path: '../../public/fonts/metropolis/Metropolis-ExtraBold-Italic.otf', weight: '800', style: 'italic' },
        { path: '../../public/fonts/metropolis/Metropolis-ExtraLight.otf', weight: '200' },
        { path: '../../public/fonts/metropolis/Metropolis-ExtraLight-Italic.otf', weight: '200', style: 'italic' },
        { path: '../../public/fonts/metropolis/Metropolis-Light.otf', weight: '300' },
        { path: '../../public/fonts/metropolis/Metropolis-Light-Italic.otf', weight: '300', style: 'italic' },
        { path: '../../public/fonts/metropolis/Metropolis-Medium.otf', weight: '500' },
        { path: '../../public/fonts/metropolis/Metropolis-Medium-Italic.otf', weight: '500', style: 'italic' },
        { path: '../../public/fonts/metropolis/Metropolis-Regular.otf', weight: '400' },
        { path: '../../public/fonts/metropolis/Metropolis-Regular-Italic.otf', weight: '400', style: 'italic' },
        { path: '../../public/fonts/metropolis/Metropolis-SemiBold.otf', weight: '600' },
        { path: '../../public/fonts/metropolis/Metropolis-SemiBold-Italic.otf', weight: '600', style: 'italic' },
        { path: '../../public/fonts/metropolis/Metropolis-Thin.otf', weight: '100' },
        { path: '../../public/fonts/metropolis/Metropolis-Thin-Italic.otf', weight: '100', style: 'italic' },
    ],
    variable: '--font-metropolis',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' className={metropolis.variable}>
            <head />
            <body>{children}</body>
        </html>
    )
}

