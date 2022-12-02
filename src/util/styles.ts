type Style = string | boolean

export function combine(...args: Style[]) {
    args = args.filter(e => !!e)
    return args.join(' ')
}