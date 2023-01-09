import DiscordOauth2 from 'discord-oauth2'
import {
    DeleteObjectCommand,
    DeleteObjectCommandInput,
    DeleteObjectCommandOutput,
    GetObjectCommand,
    GetObjectCommandInput,
    GetObjectCommandOutput,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3'
import bcrypt from 'bcryptjs'
import { Document, FindOptions, InsertManyResult, MongoClient } from 'mongodb'

import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-identicon-sprites'

import { SignupRequest } from '../../pages/api/auth/[[...auth]]'
import nanoid, { NanoID } from '../nanoid'

import { Organization, OrganizationInvitation, Role } from '../../types/Organization'
import { Session } from '../../types/Session'
import { DbUser, OAuthType, User } from '../../types/User'
import { createHash } from 'crypto'
import sharp from 'sharp'
import axios from 'axios'

/* INIT MONGODB CLIENT */
export const client = new MongoClient(process.env.MONGO_URL ?? 'mongodb://localhost:27017', {
    connectTimeoutMS: 2500,
})

const db = client.db(process.env.MONGO_DATABASE ?? 'aether')

async function createIndexes(): Promise<void> {
    await client.connect()

    await db.collection('sessions').createIndex({ id: 1 }, { unique: true })
    await db.collection('sessions').createIndex({ updatedAt: 1 }, { expireAfterSeconds: 3600 })
}

createIndexes().catch(err => {
    console.error('Failed to create indexes:', err)
})

/* INIT S3 CLIENT */

if (!process.env.S3_ENDPOINT) throw new Error('S3_ENDPOINT not set in environment')
if (!process.env.S3_REGION) throw new Error('S3_REGION not set in environment')
if (!process.env.S3_BUCKET_NAME) throw new Error('S3_BUCKET_NAME not set in environment')
if (!process.env.S3_ACCESS_KEY_ID) throw new Error('S3_ACCESS_KEY_ID not set in environment')
if (!process.env.S3_ACCESS_KEY_SECRET) throw new Error('S3_ACCESS_KEY_SECRET not set in environment')

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
    },
})

export default class Database {
    private static cleanUser(user: DbUser): User | null {
        if (!user) return null

        delete user.password
        return user
    }

    static getDbUserFromId(id: NanoID): Promise<DbUser> {
        return getDocument<DbUser>('users', { id })
    }

    static async getUserFromId(id: NanoID): Promise<User> {
        return this.cleanUser(await this.getDbUserFromId(id))
    }

    static getDbUserFromEmail(email: string): Promise<DbUser> {
        return getDocument<DbUser>('users', { email })
    }

    static async getUserFromEmail(email: string): Promise<User> {
        return this.cleanUser(await this.getDbUserFromEmail(email))
    }

    static getUserOrganizations(id: NanoID): Promise<Organization[]> {
        return getDocuments<Organization>('organizations', { 'members.id': id })
    }

    /**
     * Create a unique custom avatar for a user using dicebear
     * @param id The user's id
     */
    static async createAvatarForId(id: NanoID): Promise<string> {
        // Create the avatar using dicebear
        const avatarDataURI = createAvatar(style, {
            seed: id,
            dataUri: true,
            backgroundColor: '#ffffff',
        })

        // Convert the data URI to a buffer
        const avatarSvgBuffer = Buffer.from(decodeURIComponent(avatarDataURI.split('data:image/svg+xml;utf8,')[1]))

        // Convert the svg to a webp (all avatars will be stored as webp)
        const webp = await sharp(avatarSvgBuffer)
            .resize(1024, 1024)
            .webp({
                lossless: true,
                quality: 100,
            })
            .toBuffer()

        // Calculate the hash of the image to be used as the unique identifier
        const hash = createHash('sha1').update(webp).digest('hex')

        // Upload the webp to the cdn
        await uploadFile(`avatars/${id}/${hash}.webp`, webp, 'image/webp')

        // Return the hash for storage in the database
        return hash
    }

    /**
     * Grab an avatar from a url and upload it to the cdn for a user
     * @param id The user's id
     * @param url The url of the avatar
     */
    static async createAvatarForUserFromUrl(id: NanoID, url: string): Promise<string> {
        // Download avatar into buffer using axios
        const avatarResponse = await axios.get(url, { responseType: 'arraybuffer' })
        const avatarBuffer = avatarResponse.data

        // Resize image with sharp
        const webp = await sharp(avatarBuffer)
            .resize(1024, 1024)
            .webp({
                lossless: true,
                quality: 100,
            })
            .toBuffer()

        // Calculate the hash of the image to be used as the unique identifier
        const hash = createHash('sha1').update(webp).digest('hex')

        // Upload the webp to the cdn
        await uploadFile(`avatars/${id}/${hash}.webp`, webp, 'image/webp')

        // Return the hash for storage in the database
        return hash
    }

    static async createUserFromSignupRequest({
        username,
        firstName,
        lastName,
        email,
        password,
    }: SignupRequest): Promise<User> {
        // Create the user's ID
        const id = await nanoid()

        const avatar = await this.createAvatarForId(id)

        // Hash the user's password
        const hash = await bcrypt.hash(password, 10)

        // Create the user object
        const user: DbUser = {
            id,
            username,
            firstName,
            lastName,
            email,
            avatar,
            verified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            password: hash,
            oauthType: null,
        }

        // Insert the user into the database
        await insertOne('users', user)

        // Return the user object without the sensitive information
        return this.cleanUser(user)
    }

    static async createUserFromDiscordOAuth(discordUser: DiscordOauth2.User): Promise<User> {
        // Create the user's ID
        const id = await nanoid()

        const avatar = await this.createAvatarForUserFromUrl(
            id,
            `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp?size=1024`
        )

        // Insert the user into the database
        const user = await insertOne<DbUser>(
            'users',
            {
                id,
                username: discordUser.username,
                firstName: null,
                lastName: null,
                email: discordUser.email,
                avatar,
                verified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                password: null,
                oauthType: OAuthType.DISCORD,
            },
            true
        )

        // Return the user object without the sensitive information
        return this.cleanUser(user)
    }

    static async createUserFromGoogleOAuth(profileData, email: string): Promise<User> {
        // Create the user's ID
        const id = await nanoid()

        console.log('Name:', profileData.names)

        const profileName = profileData.names.find(n => n.metadata.primary === true)
        const username = profileName.displayName
        const firstName = profileName.givenName
        const lastName = profileName.familyName

        const profilePhoto = profileData.photos.find(p => p.metadata.primary === true)
        const avatarURL = profilePhoto.url.replace('=s100', '=s1024')

        const avatar = await this.createAvatarForUserFromUrl(id, avatarURL)

        // Insert the user into the database
        const user = await insertOne<DbUser>(
            'users',
            {
                id,
                username,
                firstName,
                lastName,
                email,
                avatar,
                verified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                password: null,
                oauthType: OAuthType.GOOGLE,
            },
            true
        )

        // Return the user object without the sensitive information
        return this.cleanUser(user)
    }

    static async createUserFromGitHubOAuth({
        username,
        avatarURL,
        email,
    }: {
        username: string
        avatarURL: string
        email: string
    }): Promise<User> {
        // Create the user's ID
        const id = await nanoid()

        const avatar = await this.createAvatarForUserFromUrl(id, avatarURL)

        // Insert the user into the database
        const user = await insertOne<DbUser>(
            'users',
            {
                id,
                username,
                firstName: null,
                lastName: null,
                email,
                avatar,
                verified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                password: null,
                oauthType: OAuthType.GITHUB,
            },
            true
        )

        // Return the user object without the sensitive information
        return this.cleanUser(user)
    }

    static async updateUserCompleteSignup(id: NanoID, name: { firstName: string; lastName: string }): Promise<User> {
        // Update the user's names
        const user = await updateDocument<DbUser>(
            'users',
            { id },
            {
                $set: {
                    firstName: name.firstName,
                    lastName: name.lastName,
                },
            }
        )

        // Return the updated user object without the sensitive information
        return this.cleanUser(user)
    }

    static validatePassword(plainTextPassword: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hash)
    }

    /**
     * Create a session for a user
     */
    static async createSessionFromUser(user: User | NanoID): Promise<Session> {
        const id = typeof user === 'string' ? user : user.id

        return insertOne<Session>(
            'sessions',
            { id: await nanoid(), userId: id, createdAt: new Date(), expireAfter: new Date() },
            true
        )
    }

    /**
     * Get the user from the session id
     */
    static async getUserFromSession(sessionId: NanoID): Promise<User> {
        const session = await getDocument<Session>('sessions', { id: sessionId })

        if (!session) return null

        return this.getUserFromId(session.userId)
    }

    /**
     * Updates the session's updatedAt field to not expire if the session is actively being used
     *
     * @param sessionId The session id
     */
    static async updateSessionDate(sessionId: NanoID): Promise<Session> {
        const session = await getDocument<Session>('sessions', { id: sessionId })

        // If the session is not close to expiring, don't update it
        if (session?.expireAfter > new Date()) return session

        return updateDocument<Session>('sessions', { id: sessionId }, { $set: { expireAfter: new Date() } })
    }

    /**
     * Destroy a session
     */
    static async destroySession(sessionId: NanoID): Promise<void> {
        await deleteOne('sessions', { id: sessionId })
    }

    /**
     * Get the organization from an id
     */
    static getOrganizationFromId(id: string): Promise<Organization> {
        return getDocument<Organization>('organizations', { id })
    }

    /**
     * Get the organization associated with a team number
     */
    static getOrganizationsFromTeamNumber(teamNumber: number): Promise<Organization[]> {
        return getDocuments<Organization>('organizations', { teamNumber })
    }

    /**
     * Create an organization
     */
    static async createOrganization(
        user: User,
        { teamNumber, name }: Pick<Organization, 'teamNumber' | 'name'>
    ): Promise<Organization> {
        const id = await nanoid()

        const avatar = await this.createAvatarForId(id)

        const organization = await insertOne<Organization>(
            'organizations',
            {
                id,
                name,
                tag: `Team${teamNumber}`,
                bio: null,
                teamNumber,
                avatar,
                members: [
                    {
                        id: user.id,
                        role: Role.OWNER,
                    },
                ],
                defaultRole: Role.VIEWER,
                invitations: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            true
        )

        return organization
    }

    /**
     * Get the members of an organization as User objects
     * @param organization The organization to get the members of
     */
    static async getOrganizationMembers(organization: NanoID): Promise<User[]> {
        const org = await this.getOrganizationFromId(organization)

        return Promise.all(org.members.map(member => this.getUserFromId(member.id)))
    }

    /**
     * Create an invitation for a user to join an organization
     * @param organization The organization to invite the user to
     * @param email The email of the user to invite
     * @param role The role to give the user
     * @param inviter The user who is inviting the user
     * @param expires The date the invitation expires
     * @returns The invitation
     * @throws {Error} If the user is already a member of the organization
     * @throws {Error} If the user is already invited to the organization
     */
    static async createOrganizationInvitation(
        inviter: NanoID,
        organization: NanoID,
        email: string,
        role: Role = Role.VIEWER
    ): Promise<OrganizationInvitation> {
        const org = await this.getOrganizationFromId(organization)

        // Get all the members of the organization with their emails
        const fullMembers = await this.getOrganizationMembers(organization)

        // Check if the user is already a member of the organization
        if (fullMembers.some(member => member.email === email))
            throw new Error('User is already a member of the organization')

        // Check if the user is already invited to the organization
        if (org.invitations.some(invitation => invitation.userEmail === email))
            throw new Error('User is already invited to the organization')

        const invitation: OrganizationInvitation = {
            id: await nanoid(),
            organizationId: organization,
            inviterId: inviter,
            userEmail: email,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
            role,
        }

        await updateDocument<Organization>(
            'organizations',
            { id: organization },
            {
                $push: {
                    invitations: invitation,
                },
            }
        )

        return invitation
    }

    /**
     * Get an invitation from its id
     */
    static async getOrganizationInvitationFromId(id: NanoID): Promise<OrganizationInvitation> {
        const org = await getDocument<Organization>('organizations', { 'invitations.id': id })

        return org?.invitations.find(invitation => invitation.id === id) ?? null
    }

    /**
     * Add a user to an organization from an invite
     */
    static async addUserToOrganization(organization: NanoID, user: NanoID, role = Role.VIEWER): Promise<void> {
        // Get the organization
        const org = await this.getOrganizationFromId(organization)

        // Add the user to the organization
        await updateDocument<Organization>(
            'organizations',
            { id: org.id },
            {
                $push: {
                    members: {
                        id: user,
                        role,
                    },
                },
            }
        )
    }

    /**
     * Delete an invitation
     */
    static async deleteOrganizationInvitation(invitation: NanoID): Promise<void> {
        const org = await getDocument<Organization>('organizations', { 'invitations.id': invitation })

        await updateDocument<Organization>(
            'organizations',
            { id: org.id },
            {
                $pull: {
                    invitations: {
                        id: invitation,
                    },
                },
            }
        )
    }
}

export async function getDocuments<T>(col: string, query = {}, limit = 0, skip = 0, sort = false): Promise<T[]> {
    await client.connect()

    return (
        await db
            .collection(col)
            .find(query, sort ? ({ score: { $meta: 'textScore' } } as FindOptions) : {})
            .skip(skip)
            .limit(limit)
            .sort(sort ? { score: { $meta: 'textScore' } } : {})
            .toArray()
    ).map(doc => {
        delete doc._id
        return doc as unknown as T
    })
}

export async function getDocument<T>(col: string, query: Document): Promise<T> {
    await client.connect()

    const doc = await db.collection(col).findOne(query)
    if (doc) delete doc._id
    return doc as unknown as T
}

export async function upsertDocument<T>(col: string, filter: Document, update: Document): Promise<T> {
    await client.connect()

    const updated = await db.collection(col).findOneAndUpdate(filter, update, {
        upsert: true,
        returnDocument: 'after',
    })

    delete updated.value._id
    return updated.value as unknown as T
}

export async function updateDocument<T>(col: string, filter: Document, update: Document): Promise<T> {
    await client.connect()

    const updated = await db.collection(col).findOneAndUpdate(filter, update, {
        returnDocument: 'after',
    })

    delete updated.value._id
    return updated.value as unknown as T
}

export async function updateDocuments<T>(col: string, filter: Document, update: Document): Promise<T> {
    await client.connect()

    return (await db.collection(col).updateMany(filter, update)) as T
}

export async function insertMany<T>(col: string, documents: T[]): Promise<InsertManyResult<T>> {
    await client.connect()

    return db.collection(col).insertMany(documents, { ordered: true, fullResponse: true })
}

export async function insertOne<T>(col: string, document: T, fetch: true): Promise<T>
export async function insertOne<T>(col: string, document: T, fetch?: false): Promise<{ insertedId: string }>
export async function insertOne<T>(col: string, document: T, fetch?: boolean): Promise<T | { insertedId: string }> {
    await client.connect()

    const res = await db.collection(col).insertOne(document, { fullResponse: true })

    if (!fetch) return res as unknown as { insertedId: string }

    return (await getDocument<T>(col, { _id: res.insertedId })) as T
}

export async function deleteOne(col: string, query: Document): Promise<void> {
    await client.connect()

    await db.collection(col).deleteOne(query)
}

export function filterUpdate(update: Document): Document {
    const filteredUpdate = {}
    for (const key in update) {
        if (update[key] !== undefined) filteredUpdate[key] = update[key]
    }
    return filteredUpdate
}

/* Digital Ocean Spaces Helpers */

export async function getFile(path: string): Promise<GetObjectCommandOutput> {
    const params: GetObjectCommandInput = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: path,
    }

    try {
        return await s3Client.send(new GetObjectCommand(params))
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function uploadFile(path: string, content: Buffer, contentType: string): Promise<PutObjectCommandOutput> {
    const params: PutObjectCommandInput = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: path,
        Body: content,
        ACL: 'public-read',
        ContentType: contentType,
    }

    try {
        return await s3Client.send(new PutObjectCommand(params))
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function deleteFile(path: string): Promise<DeleteObjectCommandOutput> {
    const params: DeleteObjectCommandInput = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: path,
    }

    const data = await s3Client.send(new DeleteObjectCommand(params))
    console.log(`Successfully deleted object: ${params.Bucket}/${params.Key}`)
    return data
}
