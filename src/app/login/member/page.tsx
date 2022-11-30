const MemberLogin = async () => {
    return (
        <>
            <p>Member login page</p>
            <form>
                <label htmlFor='username'>Username:</label>
                <input type='text' name='username' id='username' />
                <label htmlFor='password'>Password:</label>
                <input type='password' name='password' id='password' />
            </form>
        </>
    )
}

export default MemberLogin
