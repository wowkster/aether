import React, { FC } from 'react'

import styles from './Layout.module.scss'

export const FlexColumn: FC<{
    gap?: number
    children?: React.ReactNode
}> = ({ gap = 1, children }) => {
    return (
        <div
            className={styles.flex_column}
            style={{
                gap: `${gap}rem`,
            }}>
            {children}
        </div>
    )
}

export const FlexRow: FC<{
    gap?: number
    children?: React.ReactNode
}> = ({ gap = 1, children }) => {
    return (
        <div
            className={styles.flex_row}
            style={{
                gap: `${gap}rem`,
            }}>
            {children}
        </div>
    )
}
