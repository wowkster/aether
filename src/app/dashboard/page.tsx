import OrgTester from './OrgTester'

export default function Dashboard(props) {
    const { user, organization } = props.params

    console.log('Dashboard Props:', props)

    return (
        <>
            <h1>Dashboard</h1>
            <pre>{JSON.stringify(user, null, 4)}</pre>
            <pre>{JSON.stringify(organization, null, 4)}</pre>

            <OrgTester />
        </>
    )
}
