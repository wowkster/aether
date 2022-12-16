import Image from 'next/image'
import Link from 'next/link'

import { FiArrowRight } from 'react-icons/fi'

import styles from './home.page.module.scss'

import ui from '../../../../public/img/interface-transformed.png'

export default async function Home() {
    return (
        <>
            <section className={styles.hero}>
                <article className={styles.hero__left}>
                    <div className={styles.hero__left__text}>
                        <span>The ultimate scouting solution</span>
                        <h1>Scout your matches with confidence.</h1>
                        <h2>
                            Aether is a next generation scouting app built with modern technology, and with several key
                            principles in mind. We value ease of use and flexibility, but will never compromise on
                            aesthetics and user experience.
                        </h2>
                    </div>
                    <div className={styles.hero__left__cta}>
                        <Link href='/signup'>
                            <span>Sign Up Free</span> <FiArrowRight size={24} />
                        </Link>
                    </div>
                </article>
                <aside className={styles.hero__right}>
                    <Image src={ui} alt={'UI Mockup'} quality={100} priority />
                </aside>
            </section>
        </>
    )
}
