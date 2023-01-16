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
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline'
    children?: React.ReactNode
}> = ({ gap = 1, alignItems = 'flex-start', justifyContent = 'flex-start', children }) => {
    return (
        <div
            className={styles.flex_row}
            style={{
                gap: `${gap}rem`,
                justifyContent,
                alignItems,
            }}>
            {children}
        </div>
    )
}
