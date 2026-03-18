import { useState } from "react"
import styles from "./CreditRating.module.css"

function CreditRatingCalculator() {
    const [wage, setWage] = useState<number>(0);
    const [debt, setDebt] = useState<number>(0);
    const [networth, setnetWorth] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);
    const [age,setAge] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    async function calulateRating(){
        setScore(1.5);
        return;
    }
    return (
        <>
        <h1 className={styles.title}>Asmeninė kredito reitingo skaičiuoklė</h1>

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
          <button onClick={calulateRating}>Įvertinti asmenį</button>
    
          <div>Suskaičiuotas balas: {score}</div>
    
        </>
    )

}


export default CreditRatingCalculator