import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-request-url', req.url)

    return NextResponse.next({
        request: {
            // Apply new request headers
            headers: requestHeaders,
        },
    })
}
