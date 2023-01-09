import { NanoID } from '../util/nanoid'

export enum Role {
    OWNER = 'OWNER', // Permission to delete org and grant other users owner (Works like GitHub)
    ADMINISTRATOR = 'ADMINISTRATOR', // Permission to create scouting events/forms and add/remove members
    SCOUT = 'SCOUT', // Permission to submit scouting data
    VIEWER = 'VIEWER', // Permission to view scouting data and dashboards
}

export interface Organization {
    id: NanoID
    name: string
    tag: string
    bio: string | null
    teamNumber: number | null
    avatar: string | null
    members: OrganizationMember[]
    defaultRole: Role
    invitations: OrganizationInvitation[]
    createdAt: Date
    updatedAt: Date
}

export interface OrganizationMember {
    id: NanoID
    role: Role
}

export interface OrganizationInvitation {
    id: NanoID
    organizationId: NanoID
    inviterId: NanoID
    userEmail: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    role: Role
}
