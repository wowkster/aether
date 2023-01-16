import Link from 'next/link'
import React, { FC } from 'react'
import { IconType } from 'react-icons/lib'

import { AiOutlineAudit, AiOutlineSchedule } from 'react-icons/ai'
import { FaClipboardList, FaCog, FaUsers, FaUsersCog } from 'react-icons/fa'
import { GrGamepad } from 'react-icons/gr'
import { MdAssignment, MdBusiness, MdChecklist, MdLeaderboard, MdLogout, MdSchedule } from 'react-icons/md'
import { RiCalendarEventLine, RiLayoutGridFill } from 'react-icons/ri'

import { Organization } from '../../types/Organization'
import { combine } from '../../util/styles'
import { serverUseRequestUrl } from '../../util/url'
import styles from './Nav.module.scss'
import OrganizationSelector from './OrganizationSelector'

const NAV_DATA = [
    {
        title: 'View Data',
        links: [
            { href: '/dashboard/orgs/:id/drive_team', icon: RiLayoutGridFill, text: 'Drive Team Dashboard' },
            { href: '/dashboard/orgs/:id/rankings', icon: MdLeaderboard, text: 'Current Rankings' },
            { href: '/dashboard/orgs/:id/teams', icon: FaUsers, text: 'Teams' },
            { href: '/dashboard/orgs/:id/matches', icon: GrGamepad, text: 'Matches' },
        ],
    },
    {
        title: 'Scouting',
        links: [
            { href: '/dashboard/orgs/:id/attendance', icon: MdChecklist, text: 'Event Attendance' },
            { href: '/dashboard/orgs/:id/assignments', icon: MdAssignment, text: 'Scouting Assignments' },
            { href: '/dashboard/orgs/:id/schedule', icon: AiOutlineSchedule, text: 'Event Schedule' },
        ],
    },
    {
        title: 'Organization Admin',
        links: [
            { href: '/dashboard/orgs/:id/manage_members', icon: FaUsersCog, text: 'Manage Members' },
            { href: '/dashboard/orgs/:id/manage_events', icon: RiCalendarEventLine, text: 'Manage Events' },
            { href: '/dashboard/orgs/:id/manage_forms', icon: FaClipboardList, text: 'Manage Forms' },
            { href: '/dashboard/orgs/:id/schedule_assignments', icon: MdSchedule, text: 'Schedule Assignments' },
            { href: '/dashboard/orgs/:id/scouting_audit', icon: AiOutlineAudit, text: 'Scouting Audit' },
            { href: '/dashboard/orgs/:id/organization_settings', icon: MdBusiness, text: 'Organization Settings' },
        ],
    },
]

export interface NavProps {
    organizations: Organization[]
    selectedOrganization: Organization | null
}

const Nav = ({ organizations, selectedOrganization }: NavProps) => {
    const { pathname } = serverUseRequestUrl()

    return (
        <nav className={styles.nav}>
            <OrganizationSelector {...{ organizations, selectedOrganization }} />
            {selectedOrganization &&
                NAV_DATA.map(({ title, links }) => (
                    <NavSection title={title} key={title}>
                        {links.map(({ href, icon, text }) => (
                            <NavLink
                                href={href.replace(':id', selectedOrganization.id)}
                                icon={icon}
                                key={text}
                                active={
                                    href.replace(':id', selectedOrganization.id) === pathname ||
                                    (pathname === '/dashboard' && href === '/dashboard/orgs/:id/drive_team')
                                }>
                                {text}
                            </NavLink>
                        ))}
                    </NavSection>
                ))}
        </nav>
    )
}

const NavSection: FC<{
    title: string
    children: React.ReactNode
}> = ({ title, children }) => {
    return (
        <div className={styles.nav_section}>
            <label className={styles.nav_section_title}>{title}</label>
            <div className={styles.nav_section_links}>{children}</div>
        </div>
    )
}

const NavLink: FC<{
    href: string
    icon: IconType
    active?: boolean
    children: string
}> = ({ href, icon: Icon, active, children }) => {
    return (
        <Link href={href} className={combine(styles.nav_section_link, active && styles.nav_section_link_active)}>
            <Icon size={24} />
            {children}
        </Link>
    )
}

export default Nav
