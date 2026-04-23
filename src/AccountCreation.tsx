import { useState } from "react";
import styles from "./AccountCreation.module.css"

function AccountCreation({ close }: { close: () => void }){
    interface NewUser {
        email: string,
        password: string,
        telephone: string,
        fullname: string,
        citizenId: string,
        role: string
    }

    const [newUser, setNewUser] = useState<NewUser>({
        email: "",
        password: "",
        telephone: "",
        fullname: "",
        citizenId: "",
        role: "INVESTOR"
    });

    const FIELDS: { name: keyof NewUser; label: string; type: string; options?: {value: string; label2: string}[] }[] = [
        { name: "email", label: "Elektroninis pastas", type: "text"},
        { name: "password", label: "Slaptazodis", type: "text"},
        { name: "telephone", label: "Telefono numeris", type: "text"},
        { name: "fullname", label: "Vardas pavarde", type: "text"},
        { name: "citizenId", label: "Asmens ID", type: "text"},
        { name: "role", label: "Role", type: "select", options: [{value: "ADMINISTRATOR", label2: "Administratorius"}, {value: "INVESTOR", label2: "Darbuotojas"}]}
    ]

    const getDisplayValue = (name: keyof NewUser) => {
        const val = newUser[name];
        return String(val);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setNewUser(prev => ({...prev, [name]: type === "number" ? Number(value) : value}));
    };
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    async function saveNewUser(){
        const response = await fetch(`/api/users/create`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newUser), credentials: "include"});
        if(response.ok){
            alert("Issaugotas naudotojas!")
            close()
        }
        else{
            alert("Nepavyko issaugoti naudotojo")
        }
    }

    return (
        <div className={styles.creationBox}>
            <div>
                <div>
                <h1>User kurimas</h1>
                    <div>
                        {FIELDS.map(({ name, label, type, options}) => (
                            <div key={name}>
                                <label htmlFor={name}>{label}</label>
                                { type === "select" ? (
                                <select id={name} name={name} value={getDisplayValue(name)} onChange={handleSelectChange}>
                                    {options!.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label2}</option>
                                    ))}
                                </select>
                                ) : (
                                <input id={name} name={name} type={type} value={getDisplayValue(name)} onChange={handleChange}/>
                                )
                                }
                            </div>
                        ))}
                        <button onClick={ saveNewUser }>Išsaugoti</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountCreation