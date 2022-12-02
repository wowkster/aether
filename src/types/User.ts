import { NanoID } from '../util/nanoid'

export interface User {
    id: NanoID
    username: string
    firstName: string | null
    lastName: string | null
    email: string
    oauthType: OAuthType | null // If null, user is not an OAuth user
    verified: boolean
    avatar: string | null
    createdAt: Date
    updatedAt: Date
}

export enum OAuthType {
    DISCORD = 'DISCORD',
    GOOGLE = 'GOOGLE',
    GITHUB = 'GITHUB',
}

export type DbUser = User & {
    password: string | null
}
