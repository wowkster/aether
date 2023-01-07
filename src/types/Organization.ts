import { NanoID } from '../util/nanoid'

export enum Role {
    OWNER = 'OWNER',                    // Permission to delete org and grant other users owner (Works like GitHub)
    ADMINISTRATOR = 'ADMINISTRATOR',    // Permission to create scouting events/forms and add/remove members
    SCOUT = 'SCOUT',                    // Permission to submit scouting data
    VIEWER = 'VIEWER',                  // Permission to view scouting data and dashboards
}

export interface Organization {
    id: NanoID
    name: string
    bio: string | null
    teamNumber: number | null
    avatar: string | null // Hash of the avatar image
    members: {
        id: NanoID
        role: Role
    }[]
    defaultRole: Role
    createdAt: Date
    updatedAt: Date
}
