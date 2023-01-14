import React, { FC } from 'react'
import { combine } from '../util/styles'

import styles from './Button.module.scss'

export const Button: FC<{
    type?: 'solid' | 'outlined'
    children?: React.ReactNode
}> = ({ type = 'solid', children }) => {
    return (
        <button
            className={combine(
                styles.button,
                type === 'solid' && styles.solid,
                type === 'outlined' && styles.outlined
            )}>
            {children}
        </button>
    )
}
