import { customAlphabet } from 'nanoid/async'

export type NanoID = string

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid: (size?: number) => Promise<NanoID> = customAlphabet(alphabet, 24)

export default nanoid
