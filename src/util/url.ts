import { headers } from 'next/headers'

export const serverUseRequestUrl = () => {
    const headersList = headers()
    const urlHeader = headersList.get('x-request-url') as string
    return new URL(urlHeader)
}
