'use client'

import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'
import { AuthForm } from '../AuthForm'

enum LoginError {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    BAD_EMAIL = 'BAD_EMAIL',
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
    HTTP = 'HTTP',
    OTHER = 'OTHER',
}

const handleLogin = async (email: string, password: string) => {
    try {
        const res = await axios.post('/api/auth/login', {
            email,
            password,
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

    const [emailContent, setEmailContent] = useState('')
    const [passwordContent, setPasswordContent] = useState('')

    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const { isFetching, isError, data, error, refetch } = useQuery({
        queryKey: ['login'],
        queryFn: () => handleLogin(emailContent, passwordContent),
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

        setPasswordContent('')
    }, [error])

    const formIsValid = email.current?.validity.valid && password.current?.validity.valid

    return (
        <AuthForm
            disabled={!formIsValid || isFetching || data}
            isFetching={isFetching}
            error={isError && translateError(error as LoginError)}
            onSubmit={() => refetch()}>
            <input
                ref={email}
                type='email'
                placeholder='Enter email'
                value={emailContent}
                onChange={evt => setEmailContent(evt.target.value)}
                required
                pattern={`^[\\p{L}!#-'*+\\-/\\d=?^-~]+(.[\\p{L}!#-'*+\\-/\\d=?^-~])*@[^@\\s]{2,}$`}
                autoComplete='email'
            />
            <input
                ref={password}
                type='password'
                placeholder='Enter password'
                value={passwordContent}
                onChange={evt => setPasswordContent(evt.target.value)}
                required
                minLength={8}
                maxLength={64}
                autoComplete='current-password'
            />
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
