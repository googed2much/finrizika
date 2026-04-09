import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom"
import styles from "./CompanyCreation.module.css";

function CompanyCreation(){
    const {state} = useLocation();
    const {id} = state;
    return (
        <div className={styles.backgroundColor}>
            <div className={styles.profileBox}>
            <div className={styles.creationBackground}>
                <h1>Juridinis Asmuo</h1>
            <div className={styles.profileGrid}>
        <div className={styles.profileBox}>
            <EditProfile id = {id}/>
        </div>
        <div className={styles.profileBox}>
            <Rating id = {id}/>
        </div>
        <div className={`${styles.profileBox} ${styles.fullWidth}`} >
        <InputRatingInformation id ={id}/>
        </div>
        <div className={`${styles.profileBox} ${styles.fullWidth}`} >
            <Documents id={id}/>
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}
function Documents({id}: any){
    console.log("company id :", id);
    interface Document {
        id: number,
        filename: string,
        originalName: string
    };
    const[documents,setDocuments] = useState<Document[]>([]);
    

        useEffect(() => {
            fetchDocuments();    
        },[])
        const fetchDocuments = async () => {
                const res = await fetch(`/api/juridical/get/${id}/documents`);
                if(res.ok){
                    const data = await res.json();
                    setDocuments(data);
                }
        };
        const uploadDocument = async (file: File)=> {
            const formData = new FormData();
            formData.append("companyId",id.toString());
            formData.append("file",file);
            const res = await fetch("/api/juridical/upload/document", {
                method: "POST",
                body: formData
            });
            if(res.ok){
                fetchDocuments();
            }
        }
        const handleFileChange = (f : React.ChangeEvent<HTMLInputElement>)=> {
            const file = f.target.files?.[0];
            if (file) uploadDocument(file);
        };
    return (
        <>
        <div>
            <p className={styles.title}>Dokumentai</p>
            <div className={styles.documentList}>
                {
                    documents.map(doc => (
                        <div key = {doc.id} className={styles.documentItem}>
                            <span>
                                {doc.originalName}
                            </span>
                            <a href={`/api/physical/get/document/${doc.id}`}>
                            Atsiųsti
                            </a>

                        </div>

                    ))
                }
            </div>
            <button>
            <label>
                Įkelti naują failą
                <input 
                type = "file"
                hidden 
                onChange={handleFileChange}
                />
            </label>
                </button>
        </div>
        </>
    );

}
function Rating({id}:any){
    interface rating{
        totalScore : number,
        quickLiquidityRatio : number,
        interestCoverage : number,
        netDebtRatio: number,
        netProfitability : number,
        changeInSalesRevenue : number,
        equityRatio : number
    }
    const [evalu,setEvalu] = useState<rating>({
        totalScore:0,
        quickLiquidityRatio:0,
        interestCoverage:0,
        netDebtRatio:0,
        netProfitability:0,
        changeInSalesRevenue:0,
        equityRatio:0
    });
    const fetchRating = async ()=>{
        const response = await fetch(`/api/juridical/get/${id}/scores`);
        if(!response.ok){
            console.log("nepavyko gauti reitingo");
            return;
        }
        const data = await response.json();
        setEvalu(data);
    };
    useEffect(()=>{
        letterRating(evalu.totalScore);
    },[evalu.totalScore]);
    useEffect (()=>{
        fetchRating()
    },[id]);
    const [grade,setGrade] = useState<String>("-");
    const [gradeInfo,setGradeInfo] = useState<string>("-");
    function letterRating(score:number){
        if(score>=900) {setGrade("A");setGradeInfo("Labai aukštas patikimumas");}
        else if(score>=800) {setGrade("B");setGradeInfo("Aukštas patikimumas");}
        else if(score>=600) {setGrade("C");setGradeInfo("Vidutinis patikimumas");}
        else if(score>=400) {setGrade("D");setGradeInfo("Žemas patikimumas");}
        else {setGrade("E");setGradeInfo("Labai žemas patikimumas");}
    }
    return (
            <div className={styles.ratingContainer}>
                <h2 className={styles.title}>Reitingas</h2>
                <div className={styles.ratingSummary}>
                    <div className={styles.totalScore}>
                        {evalu.totalScore}
                    </div>
                    <div className={styles.gradeBlock}>
                        <div className={styles.ratingGrade}>{grade}</div>
                        <div className={styles.gradeInfo}>{gradeInfo}</div>
                    </div>
                </div>
                    <div className={styles.scoreBreakdown}>
                        <div className={styles.scoreItem}>
                            <span>Greitas likvidumo Koeficientas </span>
                            <span>{evalu.quickLiquidityRatio}</span>
                        </div>
                        <div className={styles.scoreItem}>
                            <span>Palūkanų Padengimo </span>
                            <span>{evalu.interestCoverage}</span>
                        </div>
                        <div className={styles.scoreItem}>
                            <span>Paskolų ir EBIT santykis</span>
                            <span>{evalu.netDebtRatio}</span>
                        </div>
                        <div className={styles.scoreItem}>
                            <span>Grunasis pelningumas</span>
                            <span>{evalu.netProfitability}</span>
                        </div>    
                        <div className={styles.scoreItem}>
                            <span>Pardavimų pajamų pokytis </span>
                            <span>{evalu.changeInSalesRevenue}</span>
                        </div>
                        <div className={styles.scoreItem}>
                            <span>Nuosavybės koeficientas </span>
                            <span>{evalu.equityRatio}</span>
                        </div>
                    </div>
                <button className={styles.recalculateBtn} type= "submit" onClick={fetchRating}>Perskaičiuoti vertinimą</button>
            </div>
    )
}
function InputRatingInformation({id} : any){
    interface ratingData{
        shortTermAssets : number,
        inventory : number,
        shortTermLiabilities : number,

        equity : number,
        totalAssets : number,
        
        netProfit : number,
        interest : number,
        taxes : number,
        
        financialLiabilities : number,
        cash : number,
        depreciation : number,
        amortization : number,

        salesRevenueCurrent : number,
        salesRevenue1YearOld : number,

        companyId : number
    }
    
    const [companyData,setCompanyData] = useState<ratingData>({
         shortTermAssets : 0,
        inventory : 0,
        shortTermLiabilities : 0,

        equity : 0,
        totalAssets : 0,
        
        netProfit : 0,
        interest : 0,
        taxes : 0,
        
        financialLiabilities : 0,
        cash : 0,
        depreciation : 0,
        amortization : 0,

        salesRevenueCurrent : 0,
        salesRevenue1YearOld : 0,
        companyId : id
    });
    const handleChange = ((c : React.ChangeEvent<HTMLInputElement>)=>{
        const {id,value} = c.target;
        let finalValue : any = value;
        setCompanyData({
            ...companyData,
            [id] : finalValue
        });
    });
    useEffect(()=>{
        setCompanyData({
            ...companyData,
            companyId : id
        });
    },[id]);
    useEffect(()=>{
        fetchData();
    },[id]);
    async function saveData(c : React.SubmitEvent){
        c.preventDefault();
        const response = await fetch(`/api/juridical/update/data`,{
            method: "POST",
            headers : {
              "content-type" : "application/json"  
            },
            body : JSON.stringify(companyData)
        });
        if(!response.ok){
            console.error("Nepavyko updatinti juridinio vertinimo duomenu");
            return;
        }
        console.log("company updatinta: duomenu id",response);
        alert("Sėkmingai išsaugoti duomenys");
        fetchData();
    }
    const fetchData = async () =>{
        const response = await fetch(`/api/juridical/get/data/${id}`);
        if(!response.ok){
            console.error("nepavyko paimti juridinio finansiniu duomenu");
            return;
        }
        const data = await response.json();
        setCompanyData(data);
        console.log("sekmingai paimti duomenys");
    }
    return (
        <>
        <p className={styles.title}>Finansiniai duomenys</p>
        <form onSubmit={saveData}>
          <label>Trumpalaikis turtas<input id ="shortTermAssets" type = "number" value={companyData.shortTermAssets || ""} onChange={handleChange} placeholder="Trumpalaikis turtas"/></label>
          <label>Atsargos<input id = "inventory" type = "number" value={companyData.inventory || ""} onChange={handleChange} placeholder="Atsargos" /></label>
          <label>Trumpalaikiai įsipareigojimai<input id = "shortTermLiabilities" value={companyData.shortTermLiabilities || ""} onChange={handleChange} placeholder="Trumpalaikiai įsipareigojimai" /></label>

          <label>Nuosavas kapitalas<input id = "equity" type = "number" value={companyData.equity || ""} onChange={handleChange} placeholder="Nuosavas kapitalas"/></label>
          <label>Visas turtas<input id = "totalAssets" type = "number" value={companyData.totalAssets || ""} onChange={handleChange} placeholder="Visas turtas" /></label>
        
          <label>Grynas pelnas<input id = "netProfit" type = "number" value={companyData.netProfit || ""} onChange={handleChange} placeholder="Grynas pelnas"/></label>
          <label>Palūkanos<input id = "interest" type = "number" value={companyData.interest || ""} onChange={handleChange} placeholder="Palūkanos" /></label>
          <label>Sumokėti mokesčiai<input id = "taxes" type = "number" value={companyData.taxes||""} onChange={handleChange} placeholder="Sumokėti mokesčiai" /></label>
        
          <label>Nusidėvėjimas<input id = "depreciation" type = "number" value={companyData.depreciation || ""} onChange={handleChange} placeholder="Nusidėvėjimas" /></label>
          <label>Amortizacija<input id = "amortization" type = "number" value={companyData.amortization || ""} onChange={handleChange} placeholder="Amortizacija" /></label>
          <label>Finansiniai įsipareigojimai<input id = "financialLiabilities" type = "number" value={companyData.financialLiabilities || ""} onChange={handleChange} placeholder="Finansiniai įsipareigojimai"/></label>
          <label>Grynieji pinigai<input id = "cash" type = "number" value={companyData.cash || ""} onChange={handleChange} placeholder="Grynieji pinigai" /></label>
        
          <label>Pardavimų pajamos naujausių metų<input id = "salesRevenueCurrent" type = "number" value={companyData.salesRevenueCurrent || ""} onChange={handleChange} placeholder="Pardavimų pajamos naujausių metų" /></label>
          <label>Pardavimų pajamos praeitais metais<input id = "salesRevenue1YearOld" type = "number" value={companyData.salesRevenue1YearOld || ""} onChange={handleChange} placeholder="Pardavimų pajamos praeitais metais" /></label>
        
          <button type= "submit">Išsaugoti</button>
        </form>
        </>
    )
}
function EditProfile({id}: any){
    interface profile {
        id: number
        companyId: string,
        name : string,
        email : string,
        telephone: string,
        ownerFullname: string,
    }
    const [company,setCompany] = useState<profile>({
        companyId: "",
        name : "",
        email : "",
        telephone : "",
        ownerFullname: "",
        id : 0
    });
    useEffect(()=>{
        setCompany(prev =>({
            ...prev,
            id : id
        }));
    },[id]);
    const fetchCompany = async()=>{
        const response = await fetch (`/api/juridical/get/${id}`);
        if(!response.ok){
            console.error("Nepavyko gauti imones");
            return;
        }
        const data = await response.json();
        setCompany(data);
    };
    const handleChange = ((c:React.ChangeEvent<HTMLInputElement>)=>{
        const {id,value,type} = c.target;
        let finalValue :any= value;
        if(type ==="text"){
            finalValue = String(value);
        }
        setCompany({    
            ...company,
            [id]:finalValue
        });
    });
    async function saveData(e: React.MouseEvent){
        e.preventDefault();
        const response = await fetch(`/api/juridical/update`,{
            method: "POST",
            headers : {
                "content-type":"application/json"
            },
            body : JSON.stringify(company)
        });
        if(!response.ok){
            alert("nepavyko išsaugoti naujų duomenų");
            return;
        }
        alert("duomenys išsaugoti");
        fetchCompany();
    };
    useEffect(()=>{
        fetchCompany();
    },[id]);
    async function deleteProfile(){

    }
    return (
          <>
            <h1 className={styles.title}>Profilis</h1>
            <div className={styles.profileOptions}>
              <div>
                <label>Įmonės kodas</label>
                <input
                 id = "companyId"
                  type="text"
                  value={company.companyId}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div>
                <label>Įmonės pavadinimas</label>
                <input
                    id ="name"
                  type="text"
                  value={company.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>El.paštas</label>
                <input
                 id = "email"
                  type="text"
                  value={company.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Įmonės atstovo telefono numeris</label>
                <input
                 id = "telephone"
                  type="text"
                  value={company.telephone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Įmonės atstovo pilnas vardas</label>
                <input
                id = "ownerFullname"
                  type="text"
                  value={company.ownerFullname}
                  onChange={handleChange}
                />
              </div>
                    <div className={styles.buttonDiv}>
                        <button onClick={ saveData }>Išsaugoti pakeitimus</button>
                        <button onClick={  deleteProfile}>Ištrinti</button>
                    </div>
            </div>
          
    </>
    )
}
export default CompanyCreation;