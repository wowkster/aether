'use client'

import { useInterval } from 'usehooks-ts'

const SessionHeartbeat = () => {
    useInterval(() => {
        // Send heartbeat to server to keep session alive every 5 minutes
        fetch('http://localhost:3000/api/auth/session/heartbeat', {
            method: 'POST',
        }).catch((err) => {
            console.log(err)
        })
    }, 1000 * 60 * 5)

    return <div style={{ display: 'none' }}></div>
}

export default SessionHeartbeat
