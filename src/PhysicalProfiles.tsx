import { useState } from "react";

import { Link } from "react-router-dom"
import styles from "./PhysicalProfiles.module.css"

function PhysicalProfiles() {
    interface Person {
        id: string;
        name: string;
        telephone: string;
    }

    const [personID, setPersonID] = useState<string>("");
    const [people, setPeople] = useState<Person[]>([]);


    const [wage, setWage] = useState<number>(0);
    const [debt, setDebt] = useState<number>(0);
    const [networth, setnetWorth] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);
    const [age,setAge] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    async function calculateRisk() {
        
        const response = await fetch("http://localhost:8080/api/physicalCalc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                wage: wage,
                debt: debt,
                networth: networth,
                expenses: expenses,
                age: age
            })
        })
    
        if (response.ok) {
            const data = await response.json()
            setScore(data.score)
        } else {
            alert("Nepavyko fizinio asmens duomenų apdorojimas")
        }
        console.log(score);
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
    
          <button onClick={calculateRisk}>Įvertinti asmenį</button>
    
          <div>Suskaičiuotas balas: {score}</div>

          <h1 className={styles.title}>Fizinių asmenų paieška</h1>

            <div className={styles.button_div}>
                <input type="number" min={1} step={1} placeholder="Identifikacijos kodas" value={personID} onChange={e => setPersonID(e.target.value)}></input>
                <a className={styles.link} onClick={ searchProfile }>Paieška</a>
                <Link to="/create-physical" className={styles.link}>Sukurti naują profilį</Link>
            </div>

            <table className={styles.company_table}>
                <thead>
                    <tr className={styles.company_table_thead}>
                        <th>Kodas</th>
                        <th>Pavadinimas</th>
                        <th>Telefono numeris</th>
                    </tr>
                </thead>

                {people.length > 0 && (
                <tbody>
                    {people.map(person => (
                    <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.name}</td>
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
  
    
    async function searchProfile() {
        const data = [{id:personID, name:"test name", telephone:"test telephone"}]
        setPeople(data)
        return;
    }

}

export default PhysicalProfiles