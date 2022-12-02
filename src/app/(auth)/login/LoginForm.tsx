'use client'

import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'
import { AuthForm } from '../AuthForm'

import styles from '../AuthForm.module.scss'

enum LoginError {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    BAD_EMAIL = 'BAD_EMAIL',
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
    HTTP = 'HTTP',
    OTHER = 'OTHER',
}

const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    try {
        const res = await axios.post('/api/auth/login', {
            email,
            password,
            rememberMe,
        })

        return res.data
    } catch (e: any) {
        if (!e.isAxiosError) throw LoginError.OTHER

        const err = e as AxiosError

        switch (err.response?.status) {
            case 400:
                throw LoginError.BAD_EMAIL
            case 401:
                throw LoginError.INVALID_CREDENTIALS
            default:
                throw LoginError.HTTP
        }
    }
}

const LoginForm: FC = () => {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const { isFetching, isError, data, error, refetch } = useQuery({
        queryKey: ['login'],
        queryFn: () => handleLogin(email, password, rememberMe),
        enabled: false,
        retry: false,
    })

    // If successfully logged in, redirect to the dashboard
    useEffect(() => {
        if (data) router.push('/dashboard')
    }, [data, router])

    // Reset password field when an error occurs
    useEffect(() => {
        // Don't clear if there is no error
        if (!error) return

        setPassword('')
    }, [error])

    const formIsValid = emailRef.current?.validity.valid && passwordRef.current?.validity.valid

    return (
        <AuthForm
            disabled={!formIsValid || isFetching || data}
            isFetching={isFetching}
            error={isError && translateError(error as LoginError)}
            onSubmit={() => refetch()}
        >
            <input
                ref={emailRef}
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={evt => setEmail(evt.target.value)}
                required
                pattern={`^[\\p{L}!#-'*+\\-/\\d=?^-~]+(.[\\p{L}!#-'*+-/\\d=?^-~])*@[^@\\s]{2,}$`}
                autoComplete='email'
            />
            <input
                ref={passwordRef}
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={evt => setPassword(evt.target.value)}
                required
                minLength={8}
                maxLength={64}
                autoComplete='current-password'
            />
            <div className={styles.remember_me}>
                <input
                    type='checkbox'
                    name='remember-me'
                    id='remember-me'
                    checked={rememberMe}
                    onChange={evt => setRememberMe(evt.target.checked)}
                />
                <label htmlFor='remember-me'>Remember Me</label>
            </div>
        </AuthForm>
    )
}

function translateError(error: LoginError) {
    switch (error) {
        case LoginError.BAD_EMAIL:
            return 'Invalid email address'
        case LoginError.INVALID_CREDENTIALS:
            return 'Incorrect email or password'
        case LoginError.TOO_MANY_REQUESTS:
            return 'To many requests! Slow down!'
        case LoginError.HTTP:
        case LoginError.OTHER:
        default:
            return 'An unknown error occurred!'
    }
}

export default LoginForm
