import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import sharp from 'sharp'

import { BiBell } from 'react-icons/bi'
import { GrCircleQuestion } from 'react-icons/gr'
import { HiOutlineCog } from 'react-icons/hi'
import { RiPencilFill } from 'react-icons/ri'

import { Organization } from '../../types/Organization'
import { User } from '../../types/User'
import { getColor } from '../../util/color'
import styles from './RightSideBar.module.scss'
import RightSidebarProfile from './RightSidebarProfile'

export interface RightSideBarProps {
    user: User
    organizations: Organization[]
    selectedOrganization: Organization
}

export default async function RightSideBar({ user, organizations, selectedOrganization }: RightSideBarProps) {
    const avatarUrl = `https://aether.localhost:9000/aether/avatars/${user.id}/${user.avatar}.webp`

    const { data: imgBuffer } = await axios.get(avatarUrl, {
        responseType: 'arraybuffer',
    })

    const pngBuffer = await sharp(imgBuffer).png().toBuffer()

    const mainColor = await getColor(pngBuffer)

    return (
        <>
            <div className={styles.container}>
                <section className={styles.icons}>
                    <Link className={styles.icon} href='https://docs.aetherscout.com' target='_blank'>
                        <GrCircleQuestion size={32} />
                    </Link>
                    <Link className={styles.icon} href='/dashboard/settings' target='_blank'>
                        <HiOutlineCog size={32} />
                    </Link>
                    <Link className={styles.icon} href='https://docs.aetherscout.com' target='_blank'>
                        <BiBell size={32} />
                    </Link>
                    <RightSidebarProfile user={{ id: user.id, avatar: user.avatar }} />
                </section>
                <section className={styles.profile}>
                    <div className={styles.profile_avatar}>
                        <div
                            className={styles.profile_avatar_inner}
                            style={{
                                boxShadow: `0 0 1rem 0 rgb(${mainColor.join(',')})`,
                            }}>
                            <Image src={avatarUrl} alt={'User avatar'} fill />
                            <div className={styles.profile_avatar_edit}>
                                <RiPencilFill size={18} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.profile_text}>
                        <h2>
                            {user.firstName} {user.lastName}
                        </h2>
                        <h3>Standard User</h3>
                    </div>
                </section>
            </div>
        </>
    )
}
