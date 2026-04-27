import React, { useState } from "react"
// import styles from "./CreditRating.module.css"
import styles from "./PhysicalProfiles.module.css"
import {LineChart,Line,XAxis, YAxis,Tooltip,CartesianGrid} from "recharts";
function InterestCalculator() {
    interface data{
      startingDeposit:number,
      monthlyDeposit : number,
      interest : number,
      timeInYears : number,
    }
    const [inputData,setInputData] =useState<data>({
      startingDeposit: 0,
      monthlyDeposit : 0,
      interest : 0,
      timeInYears : 0
    });
    const [finalCashDisplay,setFinalCashDisplay] = useState<string>("");
    const [yourContributionsDisplay,SetYourContributionsDisplay] = useState<string>("");
    const [growth,setGrowth] = useState<{month: number ;value :number}[]>([]);
    async function calulateInterest(){
      let finalValue =inputData.startingDeposit*Math.pow(1+((inputData.interest/100)/12),inputData.timeInYears*12);
      finalValue = finalValue+(inputData.monthlyDeposit*(Math.pow(1+((inputData.interest/100)/12),inputData.timeInYears*12)-1)/((inputData.interest/100)/12))
      setFinalCashDisplay(Number(Math.round(finalValue)).toLocaleString("en").replaceAll(","," ")+"€");
      let totalDeposits = (inputData.monthlyDeposit*inputData.timeInYears*12+inputData.startingDeposit);
      SetYourContributionsDisplay("Viso Įnešta "+(Number(Math.round(totalDeposits)).toLocaleString("en").replaceAll(","," ")+"€"));
      let investmentValue = inputData.startingDeposit;
      let additions :{month: number , value :number}[] = [];
      for(let i = 0;i<inputData.timeInYears*12;i++){
        let newValue = investmentValue*(1+((inputData.interest/100)/12))
        newValue+=inputData.monthlyDeposit;
        investmentValue = newValue;
        additions.push({month: i+1,value: Math.round(investmentValue)});
      }
      setGrowth(additions as any);
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
        <h1 className={styles.title}>Palūkanų skaičiuoklė</h1>
        <div className={styles.profileBox}>
          
        <h1 className="">Galutinė suma {finalCashDisplay} </h1>
        <h4 className="">{yourContributionsDisplay}</h4>
        <div className={styles.profileBox}>
        <label>Pradinis Įnašas
        <input type="number" id ="startingDeposit" value={inputData.startingDeposit || ""} placeholder="Pvz: 2000" onChange={handleChange}/>
        </label>
        
        </div>
        <div className={styles.profileBox}>
        
        <label>Papildomas Mėnesinis Įnašas
        <input type="number" id ="monthlyDeposit" value={inputData.monthlyDeposit || ""} placeholder="Pvz: 400" onChange={handleChange}/>
        </label>
        
        </div>
        <div className={styles.profileBox}>
        
        <label>Investicijos terminas (metais)
        <input type="number" id ="timeInYears" value={inputData.timeInYears || ""} placeholder="Pvz: 10" onChange={handleChange}/>
        </label>
        </div>
          
        <div className={styles.profileBox}>
        
        <label>Palūkanos
        <input type="number" id ="interest" value={inputData.interest || ""} placeholder="Pvz: 6" onChange={handleChange}/>
        </label>
        </div>
          <button onClick={calulateInterest} style={{margin: '20px'}}>Skaičiuoti</button>
        {finalCashDisplay !== "" &&(
          <div className={styles.profileBox}>
            <h1 className={styles.title}>Grafinė investicijos iliustracija</h1>
            <div className={styles.profileBox}>
            <LineChart width="100%" height={320} data={growth} className="" margin={{top:10,left:10,bottom:10,right:10}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{value:"MĖN",offset:-10, position:"insideBottom"}}/>
              <YAxis label={{value:"EUR", offset:0,angle:-90, position: "insideLeft"}}/>
              <Tooltip/>
              <Line type = "monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} dot ={false}/>
            </LineChart>
            </div>
          </div>
        )}
          </div>
          
          </div>
          <p>Tai yra informacinis rezultatas, kuris remiasi apytikriais skaičiavimais.</p>
        
        </>
    )

}


export default InterestCalculator