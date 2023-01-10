'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { FiLogOut, FiUser } from 'react-icons/fi'

import { RiArrowDownSFill } from 'react-icons/ri'
import { useOnClickOutside } from 'usehooks-ts'

import { User } from '../../types/User'
import styles from './RightSidebarProfile.module.scss'

export interface RightSidebarProfileProps {
    user: Pick<User, 'id' | 'avatar'>
}

export default function RightSidebarProfile({ user }) {
    const [open, setOpen] = useState(false)
    const rootRef = useRef(null)
    const dropdownRef = useRef(null)

    const handleClickOutside = () => {
        setOpen(false)
    }

    useOnClickOutside(rootRef, handleClickOutside)

    return (
        <div
            ref={rootRef}
            className={styles.wrapper}
            onClick={evt => {
                if (dropdownRef.current.contains(evt.target)) return
                setOpen(!open)
            }}>
            <Image
                src={`https://aether.localhost:9000/aether/avatars/${user.id}/${user.avatar}.webp`}
                alt={'User avatar'}
                width={32}
                height={32}
            />
            <RiArrowDownSFill
                size={20}
                className={styles.arrow}
                style={open ? { rotate: '-180deg' } : { rotate: '0deg' }}
            />

            <div
                className={styles.dropdown}
                ref={dropdownRef}
                style={
                    open
                        ? { opacity: '1', transform: 'translateY(0)', pointerEvents: 'unset' }
                        : { opacity: '0', transform: 'translateY(-1rem)', pointerEvents: 'none' }
                }>
                <div className={styles.dropdown_inner}>
                    <Link href={'/dashboard/profile'}>
                        <FiUser size={20} /> My Profile
                    </Link>
                    <Link href={'/api/auth/logout'}>
                        <FiLogOut size={20} /> Log Out
                    </Link>
                </div>
            </div>
        </div>
    )
}
