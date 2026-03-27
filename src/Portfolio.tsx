import { useEffect, useState } from "react";
import styles from "./Portfolio.module.css"
import { Link, useNavigate } from "react-router-dom"

function Portfolio() {
    const [viewType,setViewType] = useState<"physical"|"juridical">("physical");
    
    return (
        <>
            <div>
            <h1 className={styles.title}>Portfelis</h1>
            <p className={styles.title2}>Saugomų asmenų duomenys</p>
            </div>
            <div className={styles.contentBlock}></div>
            <div className={styles.pickbuttons}>
                <button
                    className={viewType === "physical" ? styles.active : ""}
                    onClick={() => setViewType("physical")}
                >
                    Fiziniai Asmenys
                </button>

                <button
                    className={viewType === "juridical" ? styles.active : ""}
                    onClick={() => setViewType("juridical")}
                >
                    Juridiniai Asmenys
                </button>
            </div>

        <div className="">
            {viewType === "physical" && <PhysicalIndividual />}
            {viewType === "juridical" && <JuridicalIndividual />}
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
    const navigate = useNavigate();
    const [individuals, setIndividuals] = useState<Person[]>([]);
    // const [people, setPeople] = useState<Person[]>([]);
    const [personID, setPersonID] = useState<string>("");

    useEffect(() =>{
        const fetchData = async () =>{
            const response = await fetch(`/api/physical/list`)
            if (response.ok) {
                const data = await response.json();
                setIndividuals(data);
            }
            return;
        }
        fetchData();
    },[]);
    // async function searchProfile() {
    //     const response = await fetch(`/api/physical/${personID}`);
    //     if (response.ok) {
    //         const data = await response.json();
    //         setPeople([data]);
    //     } else {
    //         alert("Nepavyko rasti fizinio asmens");
    //     }
    //     return;
    // }
    const filteredIndividuals = individuals.filter(individual => {
        if (personID === "") return true;
        return individual.id.toString().includes(personID);
    });
    return (
        <>
    {/* <h2 className={styles.title}>Fizinių asmenų paieška</h2> */}

            <div className={styles.button_div}>
                <input type="number" min={1} step={1} placeholder="Paieška.. įveskite kodą" value={personID} onChange={e => setPersonID(e.target.value)}></input>
                {/* <a className={styles.link} onClick={ searchProfile }>Paieška</a> */}
                <Link to="/create-physical" className={styles.link}>Sukurti naują profilį</Link>
            </div>
            
            {/* <table className={styles.company_table}>
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
            </table> */}
    <h3 className={styles.title}>Fizinių asmenų sąrašas</h3>
    <table className={styles.tableButtons}>
        <thead >
            <tr>
                <th>ID</th>
                <th>Pilnas Vardas</th>
                <th>Telefono numeris</th>
                <th>Elektroninis paštas</th>
            </tr>
        </thead>
        <tbody>
        {filteredIndividuals.length > 0 && filteredIndividuals.map(individual => (
            <tr key={individual.id}
            onClick={() => navigate("/physical-profile", { state: { id: individual.id } })}
            // className={styles.tableButtons}
            >
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
    interface Company {
        code: number;     
        owner: string;
        telephone: string;
        email: string;
    }
    
      const [searchCompanyCode, setSearchCompanyCode] = useState<string>("");
      const [companies, setCompanies] = useState<Company[]>([]);
      async function searchProfile(companyCode: any) {
        if (companyCode === "") {
          const response = await fetch(
            `/api/company/get`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
    
          if (!response.ok) {
            console.error("Failed to get all");
            return;
          }
          const data: Company[] = await response.json();
          setCompanies(data);
        } else {
          const response = await fetch(
            `/api/company/get/${companyCode}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
    
          if (!response.ok) {
            console.error("Failed to get needed");
            return;
          }
          const data: Company[] = await response.json();
          setCompanies(data);
        }
    }
    
    useEffect(() => {
        searchProfile("");
    }, []);
    return (
        <>

            <div className={styles.user_div}>
            <input type="number" min={1} step={1} placeholder="Paieška.. įveskite kodą" value={searchCompanyCode} onChange={e => {setSearchCompanyCode(e.target.value);searchProfile(e.target.value);}}></input>
            <Link to="/create-juridical" className={styles.link}>Sukurti naują profilį</Link>
            </div>
            <h3 className={styles.title}>Juridiniu asmenu sąrašas</h3>
            
            <table className={styles.company_table}>
        <thead>
          <tr className={styles.company_table_thead}>
            <th>ID</th>
            <th>Įmonės kodas</th>
            <th>Pavadinimas</th>
            <th>Telefono numeris</th>
            {/* <th>Įvertinimas</th> */}
          </tr>
        </thead>

        {companies.length > 0 && (
          <tbody>
            {companies.map((company, index) => (
            <tr key={`${index}`}>
                <td>{index}</td>
                <td>{company.code}</td>
                <td>{company.owner}</td>
                <td>{company.telephone}</td>
                {/* <td>{company.score}</td> */}
            </tr>
            ))}
          </tbody>
        )}

        {companies.length === 0 && (
        <tbody>
            <tr key="empty">
            <td colSpan={5}>Tuščia</td>
            </tr>
        </tbody>
        )}
      </table>
        </>
    )
}
export default Portfolio