import { UserSession } from '../../../util/auth'
import { IsAscii, IsInt, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { Body, createHandler, Get, Param, Post, ValidationPipe } from 'next-api-decorators'
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

class OrgsHandler {
    @Post('/')
    @RequireAuthSession()
    async createOrg(@UserSession() user: User, @Body(ValidationPipe) { teamNumber, name }: CreateOrgRequest) {
        return Database.createOrganization(user, { teamNumber, name })
    }
}

export default createHandler(OrgsHandler)
