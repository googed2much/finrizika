import { useState } from "react"
import styles from './Login.module.css'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function login(){
        const response = await fetch(`/api/users/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({email: email, password: password})})

        if (response.ok) {
            window.location.href = "/dashboard"
        } else {
            alert("Wrong email or password")
        }
    }

    return (
    <>
        <div className={styles.login_div}>
            <div className={styles.box_div}>
                <h1 className={styles.title}>Finrizikos svetainė</h1>
                
                <div className={styles.login_input_div}>
                    <label htmlFor="email">Elektroninis paštas</label>
                    <input id="email" name="email" type="text" value={email} onChange={ e => {setEmail(e.target.value)} }></input>
                </div>
            
                <div className={styles.login_input_div}>
                    <label htmlFor="password">Slaptažodis</label>
                    <input id="password" name="password" type="password" value={password} onChange={ e => {setPassword(e.target.value)} }></input>
                </div>

                <button onClick={ login } className={styles.button}>Prisijungti</button>
            </div>
        </div>
    </>
    )
}

export default Login
