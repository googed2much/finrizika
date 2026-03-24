import { useEffect, useState } from "react";
import styles from "./Portfolio.module.css"
import { Link } from "react-router-dom"

function Portfolio() {
    const [viewType,setViewType] = useState<"physical"|"juridical">("physical");
    return (
        <>
            <h1 className={styles.title}>Fizinių bei juridinių asmenų sąrašai</h1>
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={() => setViewType("physical")}
                    style={{
                        backgroundColor: viewType === "physical" ? "#aeaef2" : "#ccc"
                    }}
                >
                    Physical Individuals
                </button>

                <button
                    onClick={() => setViewType("juridical")}
                    style={{
                        backgroundColor: viewType === "juridical" ? "#aeaef2" : "#ccc"
                    }}
                >
                    Juridical Individuals
                </button>
                {viewType==="physical" && <PhysicalIndividual/>}
                {viewType==="juridical" && <JuridicalIndividual/>}
            </div>
          
        </>
    )
}

function PhysicalIndividual(){
    interface Person {
        id: number;
        fullname: string;
        telephone: string;
        email: string;
    }

    const [individuals, setIndividuals] = useState<Person[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [personID, setPersonID] = useState<string>("");

    useEffect(() =>{
        const fetchData = async () =>{
            const response = await fetch(`/api/physical/mylist`)
            if (response.ok) {
                const data = await response.json();
                setIndividuals(data);
            }
            return;
        }
        fetchData();
    },[]);
    async function searchProfile() {
        const response = await fetch(`/api/physical/${personID}`);
        if (response.ok) {
            const data = await response.json();
            setPeople([data]);
        } else {
            alert("Nepavyko rasti fizinio asmens");
        }
        return;
    }
    return (
        <>
    
    <h2 className={styles.title}>Fizinių asmenų paieška</h2>

            <div className={styles.button_div}>
                <input type="number" min={1} step={1} placeholder="Identifikacijos kodas" value={personID} onChange={e => setPersonID(e.target.value)}></input>
                <a className={styles.link} onClick={ searchProfile }>Paieška</a>
                <Link to="/create-physical" className={styles.link}>Sukurti naują profilį</Link>
            </div>
            
            <table className={styles.company_table}>
                <thead>
                    <tr key={-1} className={styles.company_table_thead}>
                        <th>Kodas</th>
                        <th>Pavadinimas</th>
                        <th>Telefono numeris</th>
                        <th>Elektroninis paštas</th>
                    </tr>
                </thead>

                {people.length > 0 && (
                <tbody>
                    {people.map(person => (
                    <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.fullname}</td>
                        <td>{person.telephone}</td>
                        <td>{person.email}</td>
                    </tr>
                    ))
                    }
                </tbody>
                )
                }

                {people.length === 0 && (
                <tbody>
                    <tr key={0}>
                        <td>Tuščia</td>
                    </tr>
                </tbody>
                )}
            </table>
    <h2 className={styles.title}>Fizinių asmenų sąrašas</h2>
    <table className={styles.user_table}>
        <thead>
            <tr>
                <th>ID</th>
                <th>Pilnas Vardas</th>
                <th>Telefono numeris</th>
                <th>Elektroninis paštas</th>
            </tr>
        </thead>

        <tbody>
        {individuals.length > 0 && individuals.map(individual => (
            <tr key={individual.id}>
                <td>{individual.id}</td>
                <td>{individual.fullname}</td>
                <td>{individual.telephone}</td>
                <td>{individual.email}</td>
            </tr>
        )
        )
        }

        {individuals.length == 0 && (
            <tr key={0}>
                <td>Tuščia</td>
            </tr>
        )}
        </tbody>
    </table>
    </>
    )
    
}
function JuridicalIndividual(){
    return (
        <>
            <h1 className={styles.title}>Juridiniu asmenu sąrašas</h1>

            <div className={styles.user_div}>
                <input type="text" placeholder="Paieška..."></input>
                <a>Sukurti juridinį asmenį</a>
            </div>
        </>
    )
}
export default Portfolio