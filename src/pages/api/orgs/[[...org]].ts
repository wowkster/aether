import { Organization } from './../../../types/Organization';
import { IsAscii, IsEmail, IsInt, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { CookieSerializeOptions } from 'cookie'
import type { NextApiResponse } from 'next'
import {
    BadRequestException,
    Body,
    createHandler,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Res,
    UnauthorizedException,
    ValidationPipe,
} from 'next-api-decorators'
import { Role } from '../../../types/Organization'
import type { User } from '../../../types/User'
import { GetAuthSession, RequireAuthSession, UserSession } from '../../../util/auth'
import { setCookie } from '../../../util/cookie'
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

const COOKIE_OPTIONS: CookieSerializeOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
}

class OrgsHandler {
    @Post('/')
    @RequireAuthSession()
    async createOrg(
        @UserSession() user: User,
        @Body(ValidationPipe) { teamNumber, name }: CreateOrgRequest,
        @Res() res: NextApiResponse<Organization>
    ) {
        const org = await Database.createOrganization(user, { teamNumber, name })

        // Set the selected organization cookie
        setCookie(res, 'organization', org.id, COOKIE_OPTIONS)

        return org
    }

    @Get('/:id')
    getOrg(@Param('id') id: string) {
        return Database.getOrganizationFromId(id)
    }

    /**
     * Invite a member to an organization
     *
     * TODO: Add rate limiting
     */
    @HttpCode(202)
    @Post('/:id/invites')
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

    @Get('/:organizationId/invites/:invitationId')
    @GetAuthSession()
    async fulfilInvite(
        @UserSession() user: User | null,
        @Param('organizationId') organizationId: string,
        @Param('invitationId') invitationId: string,
        @Res() res: NextApiResponse<unknown>
    ) {
        // Get the organization
        const org = await Database.getOrganizationFromId(organizationId)

        // If the organization does not exist, throw an error
        if (!org) {
            throw new NotFoundException('Organization not found')
        }

        // Get the invitation
        const invitation = await Database.getOrganizationInvitationFromId(invitationId)

        // If the invitation does not exist, throw an error
        if (!invitation) {
            throw new NotFoundException('Invitation not found')
        }

        // If the user session does not exist, redirect to signup page
        if (!user) {
            return res.redirect(`/signup?redirect=/api/orgs/${organizationId}/invites/${invitationId}`)
        }

        // Make sure that the user's email matches that of the invite
        if (invitation.userEmail !== user.email) {
            throw new UnauthorizedException('You are not the recipient of this invitation')
        }

        // Delete the invitation
        await Database.deleteOrganizationInvitation(invitationId)

        // Make sure that the user is not already a member of the organization
        if (org.members.find(member => member.id === user.id)) {
            return res.redirect(`/dashboard?organization=${organizationId}`)
        }

        // Add user to organization
        await Database.addUserToOrganization(organizationId, user.id, invitation.role)

        // Set the selected organization cookie
        setCookie(res, 'organization', org.id, COOKIE_OPTIONS)

        // Redirect to dashboard
        res.setHeader('Refresh', `0; url=/dashboard/orgs/${org.id}`)
        res.end()
    }
}

export default createHandler(OrgsHandler)
