import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./JuridicalProfiles.module.css"

function JuridicalProfiles() {
    interface Company {
        id: string;
        name: string;
        telephone: string;
    }

    const [companyID, setCompanyID] = useState<string>("");
    const [companies, setCompanies] = useState<Company[]>([]);

    async function searchProfile() {
        const data = [{id:companyID, name:"test name", telephone:"test telephone"}]
        setCompanies(data)
        return;
    }

    return (
        <>
            <h1 className={styles.title}>Juridinių asmenų paieška</h1>

            <div className={styles.button_div}>
                <input type="number" min={1} step={1} placeholder="Identifikacijos kodas" value={companyID} onChange={e => setCompanyID(e.target.value)}></input>
                <a className={styles.link} onClick={ searchProfile }>Paieška</a>
                <Link to="/create-juridical" className={styles.link}>Sukurti naują profilį</Link>
            </div>

            <table className={styles.company_table}>
                <thead>
                    <tr className={styles.company_table_thead}>
                        <th>Kodas</th>
                        <th>Pavadinimas</th>
                        <th>Telefono numeris</th>
                    </tr>
                </thead>

                {companies.length > 0 && (
                <tbody>
                    {companies.map(company => (
                    <tr key={company.id}>
                        <td>{company.id}</td>
                        <td>{company.name}</td>
                        <td>{company.telephone}</td>
                    </tr>
                    ))
                    }
                </tbody>
                )
                }

                {companies.length === 0 && (
                <tbody>
                    <tr key={0}>
                        <td>Tuščia</td>
                    </tr>
                </tbody>
                )}
            </table>
        </>
    )
}

export default JuridicalProfiles