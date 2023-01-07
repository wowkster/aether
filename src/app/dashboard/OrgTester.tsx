'use client'

import axios from 'axios'

const OrgTester = () => {
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
        </>
    )
}

export default OrgTester
