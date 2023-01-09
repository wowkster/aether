import Link from 'next/link'
import React, { FC } from 'react'
import { AiFillGithub } from 'react-icons/ai'
import { FaDiscord } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import theme from '../../styles/theme.module.scss'
import styles from './OAuthProviders.module.scss'

interface ProviderURLs {
    discord: string
    google: string
    github: string
}

const getOAuthProviders = async (redirect?: string): Promise<ProviderURLs> => {
    const res = await fetch(`http://localhost:3000/api/auth/providers${redirect ? `?redirect=${redirect}` : ''}`)
    const providers = await res.json()
    return providers
}

export interface OAuthProvidersProps {
    redirect?: string
}

export default async function OAuthProviders({ redirect }: OAuthProvidersProps) {
    const { discord, google, github } = await getOAuthProviders(redirect)

    return (
        <div className={styles.button_group}>
            <LoginProvider href={discord} name='Discord' icon={<FaDiscord size={32} color={theme.blurple} />} />
            <LoginProvider href={google} name='Google' icon={<FcGoogle size={32} />} />
            <LoginProvider href={github} name='Github' icon={<AiFillGithub size={32} />} />
        </div>
    )
}

const LoginProvider: FC<{
    href: string
    icon: React.ReactNode
    name: React.ReactNode
}> = ({ href, icon, name }) => {
    return (
        <Link href={href} className={styles.login_link}>
            {icon}
            <div className={styles.text}>
                <h3>Continue with {name}</h3>
            </div>
        </Link>
    )
}
