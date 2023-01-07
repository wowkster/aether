'use client'

import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'
import { AuthForm } from '../AuthForm'

enum SignUpError {
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
    HTTP = 'HTTP',
    OTHER = 'OTHER',
}

interface SignupParams {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
}

const handleSignup = async ({ username, firstName, lastName, email, password }: SignupParams) => {
    try {
        const res = await axios.post('/api/auth/signup', { username, firstName, lastName, email, password })

        return res.data
    } catch (e: any) {
        if (!e.isAxiosError) throw SignUpError.OTHER

        const err = e as AxiosError

        switch (err.response?.status) {
            default:
                throw SignUpError.HTTP
        }
    }
}

const SignupForm: FC = () => {
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const usernameRef = useRef<HTMLInputElement>(null)
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)

    const { isFetching, isError, data, error, refetch } = useQuery({
        queryKey: ['signup'],
        queryFn: () => handleSignup({ username, firstName, lastName, email, password }),
        enabled: false,
        retry: false,
    })

    // If successfully signed up, redirect to the dashboard
    useEffect(() => {
        if (data) router.push('/dashboard')
    }, [data, router])

    // Make sure all the form fields are validated
    const formIsValid =
        [usernameRef, firstNameRef, lastNameRef, emailRef, passwordRef, passwordConfirmRef].every(
            r => r.current?.validity.valid
        ) && password === passwordConfirm

    return (
        <AuthForm
            disabled={!formIsValid || isFetching || data}
            isFetching={isFetching}
            error={isError && translateError(error as SignUpError)}
            onSubmit={() => refetch().catch(() => console.log('Error signing up'))}>
            <input
                ref={usernameRef}
                type='text'
                id='username'
                name='username'
                placeholder='Enter username'
                value={username}
                onChange={evt => setUsername(evt.target.value)}
                required
                pattern={`^[a-zA-Z0-9-_\\s]+$`}
                minLength={2}
                maxLength={32}
                autoComplete='username'
            />
            <input
                ref={firstNameRef}
                type='text'
                id='firstName'
                name='firstName'
                placeholder='Enter first name'
                value={firstName}
                onChange={evt => setFirstName(evt.target.value)}
                required
                pattern={`^[a-zA-Z0-9\\'\\s]+$`}
                minLength={1}
                maxLength={32}
                autoComplete='given-name'
            />
            <input
                ref={lastNameRef}
                type='text'
                id='lastName'
                name='lastName'
                placeholder='Enter last name'
                value={lastName}
                onChange={evt => setLastName(evt.target.value)}
                required
                pattern={`^[a-zA-Z0-9\\'\\s]+$`}
                minLength={1}
                maxLength={32}
                autoComplete='family-name'
            />
            <input
                ref={emailRef}
                type='email'
                id='email'
                name='email'
                placeholder='Enter email'
                value={email}
                onChange={evt => setEmail(evt.target.value)}
                required
                pattern={`^[\\p{L}!#-'*+\\-/\\d=?^-~]+(.[\\p{L}!#-'*+\\-/\\d=?^-~])*@[^@\\s]{2,}$`}
                autoComplete='email'
            />
            <input
                ref={passwordRef}
                type='password'
                id='password'
                name='password'
                placeholder='Enter password'
                value={password}
                onChange={evt => setPassword(evt.target.value)}
                required
                minLength={8}
                maxLength={64}
                autoComplete='new-password'
            />
            <input
                ref={passwordConfirmRef}
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                placeholder='Confirm password'
                value={passwordConfirm}
                onChange={evt => setPasswordConfirm(evt.target.value)}
                required
                minLength={8}
                maxLength={64}
                autoComplete='new-password'
            />
        </AuthForm>
    )
}

function translateError(error: SignUpError) {
    switch (error) {
        case SignUpError.TOO_MANY_REQUESTS:
            return 'To many requests! Slow down!'
        case SignUpError.HTTP:
        case SignUpError.OTHER:
        default:
            return 'An unknown error occurred!'
    }
}

export default SignupForm
