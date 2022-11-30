import styles from './page.module.scss'

const getData = (): Promise<object> => new Promise(res => setTimeout(() => res({ your: 'mom' }), 1000))

export default async function Home() {
    const data = await getData()

    let elements: JSX.Element[] = []

    for (let i = 100; i < 1000; i += 100) {
        elements.push(
            <h3
                style={{
                    fontWeight: i,
                }}>
                Weight {i}
            </h3>
        )
        elements.push(
            <h3
                style={{
                    fontWeight: i,
                    fontStyle: 'italic',
                }}>
                Weight {i} Italic
            </h3>
        )
    }

    return (
        <>
            <p>Welcome to the home page!</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <div>{elements}</div>
        </>
    )
}

