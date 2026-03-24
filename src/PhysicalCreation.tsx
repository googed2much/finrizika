import { useState } from "react";
import styles from "./PhysicalCreation.module.css"

function PhysicalCreation(){
    interface PersonProfile{
        id: number;
        fullname: string;
        telephone: string;
        email: string;
        country: string;
        region: string;
        city: string;
        zipcode: string;
        birthday: Date;
        sex: string;
        homeStatus: string;
        createdById: number;
    }

    const [personProfile, setPersonProfile] = useState<PersonProfile>({
        id: 0,
        fullname: "",
        telephone: "",
        email: "",
        country: "",
        region: "",
        city: "",
        zipcode: "",
        birthday: new Date(),
        sex: "OTHER",
        homeStatus: "NONE",
        createdById: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setPersonProfile(prev => ({...prev, [name]: type === "date" ? new Date(value) : type === "number" ? Number(value) : value}));
    };
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPersonProfile(prev => ({ ...prev, [name]: value }));
    };

    async function saveProfile(){
        const response = await fetch(`/api/physical/save`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(personProfile), credentials: "include"});
        if(response.ok){
            alert("Išsaugotas");
            window.location.href = "/dashboard/portfolio";
        }
        else {
            alert("Nepavyko išsaugoti asmens");
        }
        return;
    }


    const FIELDS: { name: keyof PersonProfile; label: string; type: string; options?: {value: string; label2: string}[] }[] = [
        { name: "id",          label: "Asmens kodas",     type: "number" },
        { name: "fullname",    label: "Vardas pavardė",   type: "text"   },
        { name: "telephone",  label: "Telefono numeris",  type: "text"   },
        { name: "email",  label: "Elektroninis paštas",  type: "text"   },
        { name: "country",    label: "Šalis",             type: "text"   },
        { name: "region",     label: "Regionas",          type: "text"   },
        { name: "city",       label: "Miestas",           type: "text"   },
        { name: "zipcode",    label: "Pašto kodas",       type: "text" },
        { name: "birthday",   label: "Gimimo data",       type: "date"   },
        { name: "sex",        label: "Lytis",             type: "select", options: [{value:"MALE", label2:"Vyras"}, {value:"FEMALE", label2:"Moteris"}, {value:"OTHER", label2:"Kita"}]},
        { name: "homeStatus", label: "Namų statusas",     type: "select", options: [{value:"NONE", label2:"Nėra"}, {value:"RENTING", label2:"Nuomojasi"}, {value:"MORTGAGE", label2:"Išsiperka"}, {value:"OWNER", label2:"Turi"}]},
    ];

    const getDisplayValue = (name: keyof PersonProfile, type: string) => {
        const val = personProfile[name];
        if (type === "date" && val instanceof Date) return val.toISOString().split("T")[0];
        return String(val);
    };

    return (
        <>
        <div className={styles.creationBackground}>
            <a href="/dashboard">Grįžti atgal</a>
            <div className={styles.creationDiv}>
                <div className={styles.creationBox}>
                <h1>Fizinio asmens profilio kurimas</h1>
                    <div className={styles.creationDiv2}>
                        {FIELDS.map(({ name, label, type, options}) => (
                            <div key={name}>
                                <label htmlFor={name}>{label}</label>
                                { type === "select" ? (
                                <select id={name} name={name} value={getDisplayValue(name, type)} onChange={handleSelectChange}>
                                    {options!.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label2}</option>
                                    ))}
                                </select>
                                ) : (
                                <input id={name} name={name} type={type} value={getDisplayValue(name, type)} onChange={handleChange}/>
                                )
                                }
                            </div>
                        ))}
                        <button onClick={ saveProfile }>Išsaugoti</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default PhysicalCreation;