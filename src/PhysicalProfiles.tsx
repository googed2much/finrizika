import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import styles from "./PhysicalProfiles.module.css"

function PhysicalProfiles() {
    const { state } = useLocation();
    const { id } = state;

    interface PersonProfile1 {
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
        createdBy: string;
    }

    const [personProfile1, setPersonProfile1] = useState<PersonProfile1>({
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
        createdBy: ""
    });

    useEffect(() => {
        fetch(`/api/physical/${id}`, {method: "GET", credentials: "include"}).then(
            response => response.json()
        ).then(
            data => setPersonProfile1({...data, birthday: new Date(data.birthday)})
        ).catch(
            exception => alert(exception)
        );
    }, [id])

    //--------------------------------------------------------------------------------------------------------------------------

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setPersonProfile1(prev => ({...prev, [name]: type === "date" ? new Date(value) : type === "number" ? Number(value) : value}));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPersonProfile1(prev => ({ ...prev, [name]: value }));
    };

    const getDisplayValue = (name: keyof PersonProfile1, type: string) => {
        const val = personProfile1[name];
        if (type === "date" && val instanceof Date) return val.toISOString().split("T")[0];
        return String(val);
    };

    async function updateProfile(){
        const response = await fetch(`/api/physical/update`, {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(personProfile1), credentials: "include"});
        if(response.ok){
            alert("Pakeista");
        }
        else {
            alert("Nepavyko pakeisti asmens duomenų");
        }
        return;
    }

    async function deleteProfile(){

    }

    //--------------------------------------------------------------------------------------------------------------------------

    const FIELDS: { name: keyof PersonProfile1; label: string; type: string; options?: {value: string; label2: string}[] }[] = [
        { name: "id",          label: "Asmens kodas",     type: "disabledText" },
        { name: "fullname",    label: "Vardas pavardė",   type: "text"   },
        { name: "telephone",   label: "Telefono numeris",  type: "text"   },
        { name: "email",       label: "Elektroninis paštas",  type: "text"   },
        { name: "country",    label: "Šalis",             type: "text"   },
        { name: "region",     label: "Regionas",          type: "text"   },
        { name: "city",       label: "Miestas",           type: "text"   },
        { name: "zipcode",    label: "Pašto kodas",       type: "text" },
        { name: "birthday",   label: "Gimimo data",       type: "date"   },
        { name: "sex",        label: "Lytis",             type: "select", options: [{value:"MALE", label2:"Vyras"}, {value:"FEMALE", label2:"Moteris"}, {value:"OTHER", label2:"Kita"}]},
        { name: "homeStatus", label: "Namų statusas",     type: "select", options: [{value:"NONE", label2:"Nėra"}, {value:"RENTING", label2:"Nuomojasi"}, {value:"MORTGAGE", label2:"Išsiperka"}, {value:"OWNER", label2:"Turi"}]},
        { name: "createdBy", label: "Sukure", type: "disabledText"}
    ];

    //--------------------------------------------------------------------------------------------------------------------------



    return (
        <div className={styles.backgroundColor}>
        <a href="/dashboard/portfolio">Grįžti atgal</a>
        <div className={styles.profileGrid}>
            <div className={styles.profileBox}>
                <h1>Fizinio asmens profilis</h1>
                <div className={styles.profileOptions}>
                    {FIELDS.map(({ name, label, type, options}) => (
                        <div key={name}>
                            <label htmlFor={name}>{label}</label>
                            { type === "select" ? (
                            <select id={name} name={name} value={getDisplayValue(name, type)} onChange={handleSelectChange}>
                                {options!.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label2}</option>
                                ))}
                            </select>
                            ) : 
                            type === "disabledText" ? (
                                <input id={name} name={name} type={type} value={getDisplayValue(name, type)} disabled/>
                            ) : (
                                <input id={name} name={name} type={type} value={getDisplayValue(name, type)} onChange={handleChange}/>
                            )
                            }
                        </div>
                    ))}
                    <div className={styles.buttonDiv}>
                        <button onClick={ updateProfile }>Išsaugoti pakeitimus</button>
                        <button onClick={ deleteProfile }>Ištrinti</button>
                    </div>
                </div>
            </div>

            <div className={styles.profileBox}>

            </div>
        </div>
        </div>
      );
}

export default PhysicalProfiles