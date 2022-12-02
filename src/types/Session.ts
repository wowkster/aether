import { NanoID } from '../util/nanoid'

export interface Session {
    id: NanoID
    userId: NanoID
    createdAt: Date
    expireAfter: Date
}
