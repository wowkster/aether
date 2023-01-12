'use client'

import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'

import styles from './JoinForm.module.scss'

const joinOrganization = () => new Promise<string>(res => setTimeout(() => res('Poggers'), 1000))

const JoinForm: FC = () => {
    const { data, isFetching, error, refetch } = useQuery(['join-code'], joinOrganization, {
        enabled: false,
    })

    const [code, setCode] = useState('')

    const handleJoin = () => {
        if (!code) return

        console.log('Join Code:', code)
        setCode('')

        refetch().catch(e => console.error(e))
    }

    return (
        <form
            className={styles.wrapper}
            onSubmit={evt => {
                evt.preventDefault()
                handleJoin()
            }}>
            {!isFetching && error && <div className={styles.error}>Error!</div>}
            {!isFetching && data && <div className={styles.data}>{data}</div>}
            {isFetching && <div className={styles.loading}>Loading...</div>}
            <input
                type='text'
                id='join-code'
                placeholder='Enter a Join Code (i.e. 3H9Q1P)'
                minLength={6}
                maxLength={6}
                value={code}
                onChange={evt => setCode(evt.target.value.toUpperCase())}
            />
            <input type='submit' value='Join' />
        </form>
    )
}

export default JoinForm
