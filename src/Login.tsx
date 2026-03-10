import { useState } from "react"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function login(){
        console.log("login function with", email, " ", password)

        //if (response.ok) {
            window.location.href = "/"
        //} else {
            //alert("Wrong email or password")
        //}
    }

    return (
    <>
        <h1>Finrizikos svetainė</h1>
        <label htmlFor="email">Elektroninis paštas</label>
        <input id="email" name="email" type="text" value={email} onChange={ e => {setEmail(e.target.value)} }></input>

        <label htmlFor="password">Slaptažodis</label>
        <input id="password" name="password" type="password" value={password} onChange={ e => {setPassword(e.target.value)} }></input>

        <button onClick={ login }>Prisijungti</button>
    </>
    )
}

export default Login
