'use client'

import { FC } from 'react'

import { BiErrorAlt } from 'react-icons/bi'
import { PulseLoader } from 'react-spinners'

import styles from './AuthForm.module.scss'

export const AuthForm: FC<{
    error?: string
    disabled: boolean
    isFetching: boolean
    onSubmit: () => void
    children: React.ReactNode
}> = ({ error, disabled, isFetching, onSubmit, children }) => {
    return (
        <form
            className={styles.form}
            onSubmit={evt => {
                evt.preventDefault()
                onSubmit()
            }}>
            {error && <ErrorMessage error={error} />}
            {children}
            <button type='submit' disabled={disabled} onClick={_ => onSubmit()}>
                <PulseLoader color={'#ffffff'} loading={isFetching} size={12} />
                {!isFetching && 'Continue'}
            </button>
        </form>
    )
}

const ErrorMessage: FC<{
    error: string
}> = ({ error }) => {
    return (
        <span className={styles.error}>
            <BiErrorAlt size={24} /> Error: {error}
        </span>
    )
}
