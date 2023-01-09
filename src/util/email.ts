/* eslint-disable camelcase */
import SendGridMail from '@sendgrid/mail'
import moment from 'moment'
import { OrganizationInvitation } from '../types/Organization'
import Database from './database/mongo'

SendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

const ORG_INVITE_GROUP_ID = 20943

export async function sendInvitationEmail(invitation: OrganizationInvitation) {
    const org = await Database.getOrganizationFromId(invitation.organizationId)

    const inviter = await Database.getUserFromId(invitation.inviterId)

    const msg: SendGridMail.MailDataRequired = {
        from: {
            name: 'Aether',
            email: 'aether@wowkster.dev',
        },
        replyTo: {
            email: 'contact@aetherscout.com',
            name: 'Aether Contact',
        },
        trackingSettings: {
            clickTracking: {
                enable: true,
                enableText: false,
            },
            openTracking: {
                enable: true,
                substitutionTag: '%open-track%',
            },
            subscriptionTracking: {
                enable: false,
            },
        },
        subject: 'Sending with SendGrid is Fun',
        templateId: 'd-06b337200fe1424987bf485b6996fb99',
        asm: {
            groupId: ORG_INVITE_GROUP_ID,
        },
        personalizations: [
            {
                to: [
                    {
                        email: invitation.userEmail,
                    },
                ],
                dynamicTemplateData: {
                    Invitation_Id: invitation.id,
                    Invitation_Accept_Url: `${
                        process.env.NODE_ENV === 'production' ? 'https://aetherscout.com' : 'http://localhost:3000'
                    }/api/orgs/${org.id}/invites/${invitation.id}`,
                    Organization_Id: invitation.organizationId,
                    Organization_Name: org.name,
                    Organization_Tag: org.tag,
                    Inviter_Id: invitation.inviterId,
                    Inviter_Name: `${inviter.firstName} ${inviter.lastName}`,
                    Invitee_Email: invitation.userEmail,
                    Invitee_Role: invitation.role,
                    Invitation_Expires: moment().to(moment(invitation.expiresAt)),
                    Invitation_Expires_Date: invitation.expiresAt.toISOString(),
                    Sender_Name: 'Aether Scout',
                    Sender_Email: 'aether@wowkster.dev',
                    Sender_Address: '836 Newmans Ln.',
                    Sender_City: 'Martinsville',
                    Sender_State: 'NJ',
                    Sender_Zip: '08807',
                    Sender_Country: 'United States',
                },
            },
        ],
    }

    await SendGridMail.send(msg)

    console.log(`Invitation email sent to '${invitation.userEmail}' for invitation '${invitation.id}'`)
}
