import { IsAscii, IsEmail, IsInt, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import {
    BadRequestException,
    Body,
    createHandler,
    Get,
    HttpCode,
    Param,
    Post,
    UnauthorizedException,
    ValidationPipe,
} from 'next-api-decorators'
import { Role } from '../../../types/Organization'
import type { User } from '../../../types/User'
import { RequireAuthSession, UserSession } from '../../../util/auth'
import Database from '../../../util/database/mongo'
import { sendInvitationEmail } from '../../../util/email'

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

class InviteMemberRequest {
    @IsNotEmpty()
    @IsEmail()
    email!: string
}

class OrgsHandler {
    @Post('/')
    @RequireAuthSession()
    createOrg(@UserSession() user: User, @Body(ValidationPipe) { teamNumber, name }: CreateOrgRequest) {
        return Database.createOrganization(user, { teamNumber, name })
    }

    @Get('/:id')
    getOrg(@Param('id') id: string) {
        return Database.getOrganizationFromId(id)
    }

    /**
     * Invite a member to an organization
     */
    @HttpCode(202)
    @Post('/:id/invite')
    @RequireAuthSession()
    async addMember(
        @UserSession() user: User,
        @Param('id') orgId: string,
        @Body(ValidationPipe) { email }: InviteMemberRequest
    ) {
        const org = await Database.getOrganizationFromId(orgId)

        // Check if acting user is an admin of the organization
        if (
            !org.members.find(
                member => member.id === user.id && (member.role === Role.OWNER || member.role === Role.ADMINISTRATOR)
            )
        )
            throw new UnauthorizedException('You are not an admin of this organization')

        // Check if user is already a member of the organization
        const allMembers = await Database.getOrganizationMembers(orgId)

        if (allMembers.find(member => member.email === email))
            throw new BadRequestException('User is already a member of this organization')

        // Create organization invitation
        const invitation = await Database.createOrganizationInvitation(user.id, orgId, email)

        // Send email to user
        await sendInvitationEmail(invitation)
    }
}

export default createHandler(OrgsHandler)
