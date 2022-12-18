'use client'

import Link from 'next/link'
import React, { FC } from 'react'
import { IconType } from 'react-icons/lib'
import { usePathname } from 'next/navigation'

import { AiOutlineAudit, AiOutlineSchedule } from 'react-icons/ai'
import { FaClipboardList, FaUsers, FaUsersCog, FaCog } from 'react-icons/fa'
import { GrGamepad } from 'react-icons/gr'
import { MdAssignment, MdBusiness, MdChecklist, MdLeaderboard, MdSchedule, MdLogout } from 'react-icons/md'
import { RiCalendarEventLine, RiLayoutGridFill } from 'react-icons/ri'

import styles from './Nav.module.scss'
import { combine } from '../../util/styles'

const NAV_DATA = [
    {
        title: 'View Data',
        links: [
            { href: '/dashboard/drive_team', icon: RiLayoutGridFill, text: 'Drive Team Dashboard' },
            { href: '/dashboard/rankings', icon: MdLeaderboard, text: 'Current Rankings' },
            { href: '/dashboard/teams', icon: FaUsers, text: 'Teams' },
            { href: '/dashboard/matches', icon: GrGamepad, text: 'Matches' },
        ],
    },
    {
        title: 'Scouting',
        links: [
            { href: '/dashboard/attendance', icon: MdChecklist, text: 'Event Attendance' },
            { href: '/dashboard/assignments', icon: MdAssignment, text: 'Scouting Assignments' },
            { href: '/dashboard/schedule', icon: AiOutlineSchedule, text: 'Event Schedule' },
        ],
    },
    {
        title: 'Organization Admin',
        links: [
            { href: '/dashboard/manage_members', icon: FaUsersCog, text: 'Manage Members' },
            { href: '/dashboard/manage_events', icon: RiCalendarEventLine, text: 'Manage Events' },
            { href: '/dashboard/manage_forms', icon: FaClipboardList, text: 'Manage Forms' },
            { href: '/dashboard/schedule_assignments', icon: MdSchedule, text: 'Schedule Assignments' },
            { href: '/dashboard/scouting_audit', icon: AiOutlineAudit, text: 'Scouting Audit' },
            { href: '/dashboard/organization_settings', icon: MdBusiness, text: 'Organization Settings' },
        ],
    },
    {
        title: 'Personal',
        links: [
            { href: '/dashboard/settings', icon: FaCog, text: 'Settings' },
            { href: '/api/auth/logout', icon: MdLogout, text: 'Log Out' },
        ],
    },
]

export default function Nav() {
    const pathname = usePathname()

    return (
        <nav className={styles.nav}>
            {NAV_DATA.map(({ title, links }) => (
                <NavSection title={title} key={title}>
                    {links.map(({ href, icon, text }) => (
                        <NavLink
                            href={href}
                            icon={icon}
                            key={text}
                            active={
                                href == pathname || (pathname === '/dashboard' && href === '/dashboard/drive_team')
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
            <h3 className={styles.nav_section_title}>{title}</h3>
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
