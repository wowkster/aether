import { customAlphabet } from 'nanoid/async'

export type NanoID = string

const ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const DEFAULT_ID_LENGTH = 24

const nanoid: (size?: number) => Promise<NanoID> = customAlphabet(ID_ALPHABET, DEFAULT_ID_LENGTH)

export default nanoid
