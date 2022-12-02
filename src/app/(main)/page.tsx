import Image from 'next/image'

import styles from './page.module.scss'

import logo from '../../../public/img/logo-beta.svg'
import Link from 'next/link'

const getData = (): Promise<object> => new Promise(res => setTimeout(() => res({ your: 'mom' }), 1000))

export default async function Home() {
    const data = await getData()

    let elements: JSX.Element[] = []

    for (let i = 100; i < 1000; i += 100) {
        elements.push(
            <h3
                key={i}
                style={{
                    fontWeight: i,
                }}>
                Weight {i}
            </h3>
        )
        elements.push(
            <h3
                key={i + '-italic'}
                style={{
                    fontWeight: i,
                    fontStyle: 'italic',
                }}>
                Weight {i} Italic
            </h3>
        )
    }

    return (
        <main>
            <Image src={logo} alt={'Aether logo'} className={styles.logo} height={64} />

            <section>
                <Link href='/login'>Log In</Link>
            </section>

            <section>{elements}</section>
        </main>
    )
}

