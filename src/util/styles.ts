type Style = string | boolean

export function combine(...args: Style[]): string {
    const some = args.filter(e => !!e)
    return some.join(' ')
}
