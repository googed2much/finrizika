import { useState } from "react";

//import { Link } from "react-router-dom"
import styles from "./PhysicalProfiles.module.css"

function PhysicalProfiles() {
    interface Person {
        id: number;
        name: string;
        telephone: string;
        wage: number;
        debt: number;
        networth: number;
        expenses: number;
        age: number;
        score: number;
    }

    const [personID, setPersonID] = useState<string>("");
    const [people, setPeople] = useState<Person[]>([]);


    const [wage, setWage] = useState<number>(0);
    const [debt, setDebt] = useState<number>(0);
    const [networth, setnetWorth] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);
    const [age,setAge] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [id, setId] = useState<number>(0);
    const [name,setName] = useState<string>("vard");
    const [telephone,setTelephone]=useState<string>("0");
    
    const [saveStatus,setSaveStatus]=useState<string>("Neišsaugotas");

    async function calculateRisk() {
        
        const response = await fetch(`${import.meta.env.VITE_API_LINK}/physical/calculate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                wage: wage,
                debt: debt,
                networth: networth,
                expenses: expenses,
                age: age,
                id: id,
                name: name,
                telephone: telephone
            })
        })
    
        if (response.ok) {
            const data = await response.json()
            setScore(data.score)
            console.log(data.score);
        } else {
            alert("Nepavyko fizinio asmens duomenų apdorojimas")
        }
        
      }
    return (
        <>
          <h1>Fizinių asmenų rizikos vertinimas</h1>
    
          <div>
            <label>Mėnesinė alga</label>
            <input
              id="qlr"
              name="qlr"
              type="text"
              value={wage}
              onChange={(e) => {
                const value = e.target.value;
    
                if (/^\d*\.?\d*$/.test(value)) {
                  setWage(Number(value));
                }
              }}
            />
          </div>
    
          <div>
            <label>Įsipareigojimai, esamos pąskolos</label>
            <input
              id="er"
              name="er"
              type="text"
              value={debt}
              onChange={(e) => {
                const value = e.target.value;
    
                if (/^\d*\.?\d*$/.test(value)) {
                  setDebt(Number(value));
                }
              }}
            />
          </div>
    
          <div>
            <label>Turimo turto vertė, pvz sklypas vertė 10,000€</label>
            <input
              id="ic"
              name="ic"
              type="text"
              value={networth}
              onChange={(e) => {
                const value = e.target.value;
    
                if (/^\d*\.?\d*$/.test(value)) {
                  setnetWorth(Number(value));
                }
              }}
            />
          </div>
    
          <div>
            <label>mėnesinės išlaidos</label>
            <input
              id="nd"
              name="nd"
              type="text"
              value={expenses}
              onChange={(e) => {
                const value = e.target.value;
    
                if (/^\d*\.?\d*$/.test(value)) {
                  setExpenses(Number(value));
                }
              }}
            />
          </div>
    
          <div>
            <label>amžius</label>
            <input
              id="np"
              name="np"
              type="text"
              value={age}
              onChange={(e) => {
                const value = e.target.value;
    
                if (/^\d*\.?\d*$/.test(value)) {
                  setAge(Number(value));
                }
              }}
            />

            
          </div>


          <div>
            <label>nr-id</label>
            <input
              id="nd"
              name="nd"
              type="text"
              value={id}
              onChange={(e) => {
                const value = e.target.value;
    
                if (/^\d*\.?\d*$/.test(value)) {
                  setId(Number(value));
                }
              }}
            />
          </div>
          <div>
            <label>vardas_pavardė</label>
            <input
              id="nd"
              name="nd"
              type="text"
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                  setName(String(value));
              }}
            />
          </div>
    
          <div>
            <label>Telefono Nr</label>
            <input
              id="nd"
              name="nd"
              type="text"
              value={telephone}
              onChange={(e) => {
                const value = e.target.value;
                 setTelephone(String(value));
              }}
            />
          </div>

          <div className={styles.button_div}>
            <button onClick={calculateRisk}>Įvertinti asmenį</button>
            <button onClick={saveProfile}>Išsaugoti asmenį</button>
          </div>
          <div>Suskaičiuotas balas: {score}  |  Profilis {saveStatus}</div>

          <h1 className={styles.title}>Fizinių asmenų paieška</h1>

            <div className={styles.button_div}>
                <input type="number" min={1} step={1} placeholder="Identifikacijos kodas" value={personID} onChange={e => setPersonID(e.target.value)}></input>
                <a className={styles.link} onClick={ searchProfile }>Paieška</a>
                {/*<Link to="/create-physical" className={styles.link}>Sukurti naują profilį</Link>*/}
            </div>

            <table className={styles.company_table}>
                <thead>
                    <tr key={-1} className={styles.company_table_thead}>
                        <th>Kodas</th>
                        <th>Pavadinimas</th>
                        <th>Telefono numeris</th>
                        <th>Reitingas</th>
                    </tr>
                </thead>

                {people.length > 0 && (
                <tbody>
                    {people.map(person => (
                    <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.name}</td>
                        <td>{person.telephone}</td>
                        <td>{person.score}</td>
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
  
    
    async function searchProfile() {
        //const data = [{id:personID, name:"test name", telephone:"test telephone"}]
        const response = await fetch(
            `${import.meta.env.VITE_API_LINK}/physical/${personID}`
        );
        
        if (response.ok) {
            const data = await response.json();
            setPeople([data]);
        } else {
            alert("Nepavyko rasti fizinio asmens");
        }
        return;
    }
    async function saveProfile(){
        const response = await fetch(
            `${import.meta.env.VITE_API_LINK}/physical/save/${id}`,{method: "POST"}
        );
        if(response.ok){
            setSaveStatus("Išsaugotas");
        }
        else {
            alert("Nepavyko išsaugoti asmens");
        }
        return;
    }

}

export default PhysicalProfiles