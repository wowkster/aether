import { UserSession } from './../../../util/auth'
import { IsAscii, IsInt, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { Body, createHandler, Post, ValidationPipe } from 'next-api-decorators'
import { RequireAuthSession } from '../../../util/auth'
import type { User } from '../../../types/User'
import Database from '../../../util/database/mongo'

class CreateOrgRequest {
    @IsNotEmpty()
    @IsInt()
    teamNumber!: number

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(32)
    @IsAscii()
    name!: string
}

class OrgHandler {
    @Post('/')
    @RequireAuthSession()
    async createOrg(@Body(ValidationPipe) { teamNumber, name }: CreateOrgRequest, @UserSession() user: User) {
        console.log('Creating org:', { teamNumber, name })

        await Database.createOrganization(user, teamNumber, name)

        return {
            message: 'Creating organization',
        }
    }
}

export default createHandler(OrgHandler)
