'use client'

import axios from 'axios'
import { useState } from 'react'

const OrgTester = () => {
    const [orgId, setOrgId] = useState('')

    return (
        <>
            <button
                onClick={() => {
                    axios
                        .post('/api/orgs', {
                            teamNumber: 303,
                            name: 'Test Org',
                        })
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }}>
                Create Org
            </button>

            <form
                onSubmit={evt => {
                    evt.preventDefault()
                    axios
                        .post(`/api/orgs/${orgId}/invite`, {
                            email: 'test@wowkster.com',
                        })
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }}>
                <input
                    type='text'
                    name='org-id'
                    id='org-id'
                    placeholder='Org ID'
                    value={orgId}
                    onChange={evt => setOrgId(evt.target.value)}
                />
                <input type='submit' value='Invite Email' />
            </form>
        </>
    )
}

export default OrgTester
