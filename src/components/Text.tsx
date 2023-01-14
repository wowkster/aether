import React, { FC } from 'react'
import { combine } from '../util/styles'

import styles from './Text.module.scss'

export interface TextProps {
    children: React.ReactNode
}

export const Paragraph: FC<TextProps> = ({ children }) => {
    return <p className={combine(styles.text, styles.paragraph)}>{children}</p>
}

export const Span: FC<TextProps> = ({ children }) => {
    return <span className={combine(styles.text, styles.span)}>{children}</span>
}

export const PageTitle: FC<TextProps> = ({ children }) => {
    return <h1 className={combine(styles.text, styles.page_title)}>{children}</h1>
}

export const PageSubtitle: FC<TextProps> = ({ children }) => {
    return <p className={combine(styles.text, styles.page_subtitle)}>{children}</p>
}

export const PageSectionTitle: FC<TextProps> = ({ children }) => {
    return <h2 className={combine(styles.text, styles.page_section_title)}>{children}</h2>
}
