import { useEffect, useState } from "react"
import styles from "./ProfilePage.module.css"

function ProfilePage() {
    interface CurrentUser{
        id: string;
        email: string;
        telephone: string;
        password: string | undefined;
        fullname: string;
        personId: string; 
    }

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setCurrentUser(prev => prev ? { ...prev, [name]: value } : prev)
    }

    useEffect(() => {
        fetch(`/api/users/get-current`, { credentials: "include" })
            .then(res => res.json())
            .then(data => setCurrentUser(data))
    }, [])

    async function updateInformation(){
        if (!currentUser) return

        await fetch(`/api/users/update`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentUser)
        })
    }

    return (
        <>
            <h1 className={styles.title}>Profilis</h1>

            <div className={styles.profile_div}>
                <div>
                    <label htmlFor="id">ID:</label>
                    <input id="id" name="id" type="text" value={currentUser?.id ?? ""} disabled></input> 
                </div>

                <div>
                    <label htmlFor="email">Elektroninis paštas:</label>
                    <input id="email" name="email" type="text" value={currentUser?.email ?? ""} onChange={handleChange}></input> 
                </div>

                <div>
                    <label htmlFor="password">Naujas slaptažodis:</label>
                    <input id="password" name="password" type="text" value={currentUser?.password ?? ""} onChange={handleChange}></input> 
                </div>

                <div>
                    <label htmlFor="telephone">Telefono numeris:</label>
                    <input id="telephone" name="telephone" type="text" value={currentUser?.telephone ?? ""} onChange={handleChange}></input> 
                </div>

                <div>
                    <label htmlFor="fullname">Pilnas vardas:</label>
                    <input id="fullname" name="fullname" type="text" value={currentUser?.fullname?? ""} onChange={handleChange}></input> 
                </div>

                <div>
                    <label htmlFor="fullname">Asmens kodas</label>
                    <input id="personId" name="personId" type="text" value={currentUser?.personId ?? ""} onChange={handleChange}></input>                    
                </div>


                <a className={styles.button_save} onClick = { _ => { updateInformation() } }>Išsaugoti</a>
            </div>
        </>
    )
}

export default ProfilePage