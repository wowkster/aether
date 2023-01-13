'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

import { Organization } from '../../../types/Organization'

import styles from './CreateOrganizationForm.module.scss'

const createOrganization = async ({ teamNumber, teamName }) => {
    const { data } = await axios.post<unknown, { data: Organization }>('/api/orgs', { teamNumber, name: teamName })
    return data
}

const CreateOrganizationForm: FC = () => {
    const { data, error, isFetching, refetch } = useQuery(
        ['create-organization'],
        () => createOrganization({ teamNumber, teamName }),
        {
            enabled: false,
        }
    )

    const [teamNumber, setTeamNumber] = useState('')
    const [teamName, setTeamName] = useState('')

    const router = useRouter()

    const handleSubmit = () => {
        // Send POST API request
        refetch().catch(e => console.error(e))

        // Reset form input values
        setTeamNumber('')
        setTeamName('')
    }

    useEffect(() => {
        if (!data || !router) return

        // Redirect to org dashboard after org is created
        router.push(`/dashboard/orgs/${data.id}`)
    }, [data, router])

    return (
        <form
            className={styles.form}
            onSubmit={evt => {
                evt.preventDefault()
                handleSubmit()
            }}>
            {error && (
                <div className={styles.error}>
                    <>Error: {error}</>
                </div>
            )}
            <div className={styles.form_fieldset}>
                <input
                    type='text'
                    name='team-number'
                    id='team-number'
                    placeholder='Enter your team’s number (i.e. 303)'
                    minLength={1}
                    maxLength={4}
                    required
                    pattern='[0-9]{1,4}'
                    title='Number between 1-9999'
                    value={teamNumber}
                    onChange={evt => setTeamNumber(evt.target.value)}
                />
                <label htmlFor='team-number'>Team Number</label>
            </div>
            <div className={styles.form_fieldset}>
                <input
                    type='text'
                    name='team-name'
                    id='team-name'
                    placeholder='Enter your team’s name (i.e. "T.E.S.T. Team 303" or "RoboWarriors")'
                    maxLength={32}
                    required
                    value={teamName}
                    onChange={evt => setTeamName(evt.target.value)}
                />
                <label htmlFor='team-name'>Team Name</label>
            </div>
            <button type='submit' disabled={isFetching}>
                <PulseLoader color={'#ffffff'} loading={isFetching} size={12} />
                {!isFetching && 'Create Organization'}
            </button>
        </form>
    )
}

export default CreateOrganizationForm
