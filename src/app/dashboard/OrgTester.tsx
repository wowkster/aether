'use client'

import axios from 'axios'

const OrgTester = () => {
    return (
        <>
            <button
                onClick={() => {
                    axios.post('/api/org', {
                        teamNumber: 303,
                        name: 'Test Org',
                    }).then(res => {
                        console.log(res)
                    })
                }}>Create Org</button>
        </>
    )
}

export default OrgTester
