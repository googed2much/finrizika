import { useState } from "react";
import { Link } from "react-router-dom"
import styles from "./PhysicalProfiles.module.css"

function PhysicalProfiles() {
    interface Person {
        id: number;
        fullname: string;
        telephone: string;
    }

    const [personID, setPersonID] = useState<string>("");
    const [people, setPeople] = useState<Person[]>([]);

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
          <h1 className={styles.title}>Fizinių asmenų paieška</h1>

            <div className={styles.button_div}>
                <input type="number" min={1} step={1} placeholder="Identifikacijos kodas" value={personID} onChange={e => setPersonID(e.target.value)}></input>
                <a className={styles.link} onClick={ searchProfile }>Paieška</a>
                <Link to="/create-physical" className={styles.link}>Sukurti naują profilį</Link>
            </div>

            <table className={styles.company_table}>
                <thead>
                    <tr key={-1} className={styles.company_table_thead}>
                        <th>Kodas</th>
                        <th>Vardas pavardė</th>
                        <th>Telefono numeris</th>
                    </tr>
                </thead>

                {people.length > 0 && (
                <tbody>
                    {people.map(person => (
                    <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.fullname}</td>
                        <td>{person.telephone}</td>
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
        </>
      );
}

export default PhysicalProfiles