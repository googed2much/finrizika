import React, { useState } from "react"
// import styles from "./CreditRating.module.css"
import styles from "./PhysicalProfiles.module.css"
function CreditRatingCalculator() {
    interface data{
      netIncome : number,
      monthlyPayments:number,
      dependents : number,
      interest : number,
      timeInYears : number,
    }
    const [inputData,setInputData] =useState<data>({
      netIncome : 0,
      monthlyPayments : 0,
      dependents : 0,
      interest : 0.04,
      timeInYears : 15
    });
    const [debtDisplay,setDebtDisplay] = useState<string>("");
    async function calulateRating(){
      let debt =0;
      let familyValue = inputData.netIncome-(inputData.dependents*450);
      let incomeDebtRatio = (inputData.netIncome*0.4)-inputData.monthlyPayments;
      debt = (Math.min(familyValue,incomeDebtRatio)*(1-Math.pow(1+(inputData.interest/12),(-inputData.timeInYears*12))))/(inputData.interest/12)
      setDebtDisplay(Number(Math.round(debt)).toLocaleString("en").replace(","," ")+"€");
        return;
    }
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
       const {id,type,value} = e.target;
       let finalValue : any = value;
       if(type === "number"){
        finalValue = Number(value);
       }
       setInputData({
        ...inputData,
        [id] : finalValue
       });
    }
    return (
        <>
        <div className={styles.creationBackground}>
        <h1 className={styles.title}>Paskolos skaičiuoklė</h1>
        <div className={styles.profileBox}>
          
        <h1 className="">Didžiausia galima paskolos suma {debtDisplay} </h1>
        <div className={styles.profileBox}>
        <label>Jūsų ir sutuoktinio grynosios mėnesio pajamos
        <input type="number" id ="netIncome" value={inputData.netIncome || ""} placeholder="Pvz: 2000" onChange={handleChange}/>
        </label>
        
        </div>
        <div className={styles.profileBox}>
        
        <label>Bendra įmokų suma, kurią mokate per mėnesį už turimas šeimos paskolas
        <input type="number" id ="monthlyPayments" value={inputData.monthlyPayments || ""} placeholder="Pvz: 400" onChange={handleChange}/>
        </label>
        
        </div>
        <div className={styles.profileBox}>
        
        <label>Išlaikytinių šeimoje skaičius
        <input type="number" id ="dependents" value={inputData.dependents || ""} placeholder="Pvz: 2" onChange={handleChange}/>
        </label>
        
        </div>
        <div className={styles.profileBox}>
        
        <label>Paskolos terminas (metais)
        <input type="number" id ="timeInYears" value={inputData.timeInYears || ""} placeholder="Pvz: 10" onChange={handleChange}/>
        </label>
        </div>
          <button onClick={calulateRating}>Skaičiuoti</button>
    
          </div>
          </div>
          
          <p>Tai yra informacinis rezultatas, kuris remiasi apytikriais skaičiavimais.</p>

        </>
    )

}


export default CreditRatingCalculator