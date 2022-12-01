import { NanoID } from '../util/nanoid'

export interface Organization {
    id: NanoID
    name: string
    bio: string | null
    teamNumber: number | null
    avatar: string | null // Hash of the avatar image
    owner: NanoID // User ID
    members: NanoID[] // User IDs
    createdAt: Date
    updatedAt: Date
}
