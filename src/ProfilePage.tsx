import { useState } from "react"
import styles from "./ProfilePage.module.css"

function ProfilePage() {
    const [workerId, _] = useState<string>("1")
    const [workerFullname, setWorkerFullname] = useState<string>("test name")
    const [workerEmail, setWorkerEmail] = useState<string>("test email");
    const [workerTelephone, setWorkerTelephone] = useState<string>("test telephone");
    const [workerPassword, setWorkerPassword] = useState<string>("testpassword");

    async function unhidePassword(){
        const passwordText = document.getElementById("worker_password")
        const type = passwordText?.getAttribute("type") === "password" ? "text" : "password"
        passwordText?.setAttribute("type", type)

        const passwordButton = document.getElementById("password_button")
        const type2 = passwordButton?.textContent === "Rodyti" ? "Slėpti" : "Rodyti"
        if (passwordButton) {
            passwordButton.textContent = type2;
        }
    }

    async function updateInformation(){
        console.log("saved")
    }

    return (
        <>
            <h1 className={styles.title}>Profilis</h1>

            <div className={styles.profile_div}>
                <div>
                    <label htmlFor="worker_id">ID:</label>
                    <input id="worker_id" name="worker_id" type="text" value={workerId} disabled></input> 
                </div>

                <div>
                    <label htmlFor="worker_email">Pilnas vardas:</label>
                    <input id="worker_email" name="worker_email" type="text" value={workerEmail} onChange={ e => {setWorkerEmail(e.target.value)} }></input> 
                </div>

                <div>
                    <label htmlFor="worker_fullname">Elektroninis paštas:</label>
                    <input id="worker_fullname" name="worker_fullname" type="text" value={workerFullname} onChange={ e => {setWorkerFullname(e.target.value)} }></input> 
                </div>

                <div>
                    <label htmlFor="worker_telephone">Telefono numeris:</label>
                    <input id="worker_telephone" name="worker_telephone" type="text" value={workerTelephone} onChange={ e => {setWorkerTelephone(e.target.value)} }></input> 
                </div>

                <div>
                    <label htmlFor="worker_password">Slaptažodis:</label>
                    <input id="worker_password" name="worker_password" type="password" value={workerPassword} onChange={ e => {setWorkerPassword(e.target.value)} }></input>
                    <button id="password_button" onClick={ e => { unhidePassword() } }>Rodyti</button> 
                </div>

                <a className={styles.button_save} onClick = { e => { updateInformation() } }>Išsaugoti</a>
            </div>
        </>
    )
}

export default ProfilePage