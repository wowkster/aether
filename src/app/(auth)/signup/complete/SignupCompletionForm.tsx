'use client'

import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'
import { User } from '../../../../types/User'
import { AuthForm } from '../../AuthForm'

enum SignUpCompletionError {
    INVALID_FORM = 'INVALID_FORM',
    FIELDS_ALREADY_FILLED = 'FIELDS_ALREADY_FILLED',
    HTTP = 'HTTP',
    OTHER = 'OTHER',
}

function translateError(error: SignUpCompletionError) {
    switch (error) {
        case SignUpCompletionError.INVALID_FORM:
            return 'The values you provided were not valid!'
        case SignUpCompletionError.HTTP:
        case SignUpCompletionError.OTHER:
        default:
            return 'An unknown error occurred!'
    }
}

interface SignupCompletionParams {
    firstName: string
    lastName: string
}

const handleSignupCompletion = async ({ firstName, lastName }: SignupCompletionParams): Promise<User> => {
    try {
        const res = await axios.post('/api/auth/signup/complete', { firstName, lastName })

        return res.data
    } catch (e: any) {
        if (!e.isAxiosError) throw SignUpCompletionError.OTHER

        const err = e as AxiosError

        const errors = (err.response?.data as any)?.errors as string[]

        if (errors && errors.includes('FIELDS_ALREADY_FILLED')) throw SignUpCompletionError.FIELDS_ALREADY_FILLED

        switch (err.response?.status) {
            default:
                throw SignUpCompletionError.HTTP
        }
    }
}

const SignupForm: FC<{
    redirect?: string
}> = ({ redirect }) => {
    const router = useRouter()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)

    const { isFetching, isError, data, error, refetch } = useQuery({
        queryKey: ['signup-complete'],
        queryFn: () => handleSignupCompletion({ firstName, lastName }),
        enabled: false,
        retry: false,
    })

    // If successfully signed up, redirect to the dashboard
    useEffect(() => {
        if (data) router.push(`/dashboard${redirect ? `?redirect=${redirect}` : ''}`)
    }, [data, router, redirect])

    // If a conflict error is thrown, redirect to the dashboard anyway
    useEffect(() => {
        if (error === SignUpCompletionError.FIELDS_ALREADY_FILLED) router.push('/dashboard')
    }, [error, router])

    // Make sure all the form fields are validated
    const formIsValid = [firstNameRef, lastNameRef].every(r => r.current?.validity.valid)

    return (
        <AuthForm
            disabled={!formIsValid || isFetching || !!data}
            isFetching={isFetching}
            error={isError && translateError(error as SignUpCompletionError)}
            onSubmit={() => refetch()}>
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
        </AuthForm>
    )
}

export default SignupForm
