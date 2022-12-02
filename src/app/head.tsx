const data = {
    title: 'Aether',
    site_name: 'Aether Scout',
    description:
        'Aether is a next generation scouting app for FRC built with modern technology and flexibility in mind',
    author: 'Team 303',
    url: 'https://aetherscout.com/',
    image: 'https://aetherscout.com/img/logo-banner.png',
    keywords:
        'aether,scout,scouting,aetherscout,aether scout,frc,robotics,data,analytics,software,solution,service,saas,ftc,first,first robotics,scoutradioz,frc scouting,scouting app,scout app,app,pwa,progressive web app,offline,offline support,dashboard',
    color: '#377dff',
}

export default function Head() {
    return (
        <>
            <title>Aether</title>

            <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
            <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
            <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
            <link rel='manifest' href='/site.webmanifest' />
            <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#347eff' />
            <meta name='msapplication-TileColor' content='#ffffff' />
            <meta name='msapplication-TileImage' content='/mstile-144x144.png' />
            <meta name='theme-color' content='#ffffff' />

            <meta charSet='UTF-8' />
            <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <meta name='theme-color' content={data.color} />
            <meta property='og:title' content={data.title} />
            <meta property='og:site_name' content={data.site_name} />
            <meta property='og:description' content={data.description} />
            <meta property='og:image' content={data.image} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta property='og:url' content={data.url} />
            <meta property='og:type' content='website' />
            <meta name='description' content={data.description} />
            <meta name='keywords' content={data.keywords} />
            <meta name='author' content={data.author} />
            <link rel='manifest' href='/manifest.json' />

            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Black.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Black-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-ExtraBold.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-ExtraBold-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Bold.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Bold-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-SemiBold.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-SemiBold-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Medium.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Medium-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Regular.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Regular-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Light.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Light-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-ExtraLight.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-ExtraLight-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Thin.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
            <link
                rel='preload'
                href='/fonts/metropolis/Metropolis-Thin-Italic.otf'
                as='font'
                type='font/otf'
                crossOrigin='anonymous'
            />
        </>
    )
}
