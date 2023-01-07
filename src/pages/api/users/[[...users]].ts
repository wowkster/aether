import { createHandler, Get, Param } from 'next-api-decorators'
import type { User } from '../../../types/User'
import { GetAuthSession, UserSession } from '../../../util/auth'
import Database from '../../../util/database/mongo'

class UsersHandler {
    @Get('/:id')
    @GetAuthSession()
    async getOrg(@UserSession() user: User | null, @Param('id') id: string) {
        // If user is requesting themselves, use a shortcut AND return the ENTIRE object
        if (user?.id == id) return user

        // Otherwise, request the user from db and strip the more sensitive data
        const fullUser = await Database.getUserFromId(id)

        delete fullUser.email
        delete fullUser.oauthType

        return fullUser
    }
}

export default createHandler(UsersHandler)
