import { useState } from "react";

function PhysicalCreation(){
    interface PersonProfile{
        id: number;
        fullname: string;
        telephone: string;
        country: string;
        region: string;
        city: string;
        zipcode: number;
        birhtday: Date;
        sex: string;
        homeStatus: string;
        createdById: number;
    }

    const [personProfile, setPersonProfile] = useState<PersonProfile>({
        id: 0,
        fullname: "",
        telephone: "",
        country: "",
        region: "",
        city: "",
        zipcode: 0,
        birhtday: new Date(),
        sex: "OTHER",
        homeStatus: "NONE",
        createdById: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

            setPersonProfile(prev => ({
                ...prev,
                [name]: type === "date"   ? new Date(value) : type === "number" ? Number(value) : value,                               
            }));
    };

    async function saveProfile(){
        const response = await fetch(`${import.meta.env.VITE_API_LINK}/physical/save`, {method: "POST"});
        if(response.ok){
            alert("Išsaugotas");
        }
        else {
            alert("Nepavyko išsaugoti asmens");
        }
        return;
    }

    return (
        <>
            <h1>Fizinio asmens profilio kurimas</h1>

            <label htmlFor="id">Asmens kodas</label>
            <input name="id" type="text" value={personProfile.id} onChange={handleChange} />

            <label htmlFor="fullname">Vardas pavardė</label>
            <input name="fullname" type="text" value={personProfile.fullname} onChange={handleChange} />

            <label htmlFor="telephone">Telefono numeris</label>
            <input name="telephone" type="text" value={personProfile.telephone} onChange={handleChange} />


        </>
    )

}

export default PhysicalCreation;