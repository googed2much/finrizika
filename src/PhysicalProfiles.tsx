import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import styles from "./PhysicalProfiles.module.css"

function PhysicalProfiles() {
    const { state } = useLocation();
    const { id } = state;
    console.log("id: ",id);
    return (
        <div className={styles.backgroundColor}>
            <div className={styles.profileBox}>
                <div className={styles.creationBackground}>
                <h1 className="">Fizinis Asmuo</h1>
                    <div className={styles.profileGrid}>
                        <div className={styles.profileBox}>
                            <EditProfile id = {id}/>
                        </div>

                        <div className={styles.profileBox}>
                            <Rating personId ={id}/>
                        </div>
                        
                        <div className={`${styles.profileBox} ${styles.fullWidth}`}>
                            <Employment personId={id}/>
                        </div>

                        <div className={`${styles.profileBox} ${styles.fullWidth}`}>
                            <CreditHistory personId={id}/>
                        </div>

                        <div className={`${styles.profileBox} ${styles.fullWidth}`}>
                            <Documents personId={id}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
}

function Rating({personId}:any){
    interface rating{
        totalScore : number,
        lengthScore : number,
        salaryScore : number,
        latenessScore : number,
        dtiScore : number
    }
    const [evalu,setEvalu] = useState<rating>({
        totalScore:0,
        lengthScore:0,
        salaryScore:0,
        latenessScore:0,
        dtiScore:0
    });
    const fetchRating = async ()=>{
        const response = await fetch(`/api/physical/get/${personId}/scores`);
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
    },[personId]);
    const [grade,setGrade] = useState<String>("-");
    const [gradeInfo,setGradeInfo] = useState<string>("-");
    function letterRating(score:number){
        if(score>=90) {setGrade("A");setGradeInfo("Labai aukštas patikimumas");}
        else if(score>=80) {setGrade("B");setGradeInfo("Aukštas patikimumas");}
        else if(score>=60) {setGrade("C");setGradeInfo("Vidutinis patikimumas");}
        else if(score>=40) {setGrade("D");setGradeInfo("Žemas patikimumas");}
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
                            <span>DTI </span>
                            <span>{evalu.dtiScore}</span>
                        </div>
                        <div className={styles.scoreItem}>
                            <span>Vėlavimas</span>
                            <span>{evalu.latenessScore}</span>
                        </div>
                        <div className={styles.scoreItem}>
                            <span>Alga </span>
                            <span>{evalu.salaryScore}</span>
                        </div>
                        <div className={styles.scoreItem}>
                            <span>Darbingumas</span>
                            <span>{evalu.lengthScore}</span>
                        </div>    
                    </div>
                <button className={styles.recalculateBtn} type= "submit" onClick={fetchRating}>Perskaičiuoti vertinimą</button>
            </div>
    )
}
function Employment({personId}:any){

    interface work{
        personId : number,
        salary : number,
        post : number,
        employer : string,
        position : string,
        startDate : Date,
        endDate : Date | null,
        workphone : string
    }

    interface workForList{
        id : number,
        salary : number,
        post : number,
        employer : string,
        position : string,
        startDate : string,
        endDate : string,
        workphone : string
    }

    const [workPlace,setWorkPlace] = useState<work>({
        personId: personId,
        salary: 0,
        post : 1,
        employer: "",
        position: "",
        startDate: new Date(),
        endDate: null,
        workphone: ""
    });

    const [workList,setWorkList] = useState<workForList[]>([]);
    // const [postString,setPostString] = useState<string>("Pilnu Etatu");
    useEffect(()=>{
        setWorkPlace(prev => ({
            ...prev,
            personId:personId
        }));
    },[personId]);

    const handleChange = (c:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        const {id, value, type} = c.target;
        let finalValue: any = value;
        if(type === 'number'){
            finalValue = Number(value);
        }
        else if (type ==='date'){
            finalValue = new Date(value);
        }
        else if (type ==='text'){
            finalValue = String(value);
        }
        else {
            finalValue = String(value);
        }
        setWorkPlace({
            ...workPlace,
            [id]:finalValue
        });
    }

    useEffect(()=>{
        if(workPlace.post===1){
        // setPostString("Pilnu etatu");
        }
        else if (workPlace.post===0.5){
            // setPostString("Dalinai");
        }
        else if (workPlace.post===0){
            // setPostString("Kontraktinis");
        }
    }, [workPlace.post]);

    const jobList =async ()=>{
        const response = await fetch(`/api/physical/get/${personId}/employment`);
        if(!response.ok){
            console.log("nepavyko gauti saraso darbovieciu");
            return;
        }
        const data = await response.json();
        setWorkList(data);
    }

    useEffect (()=>{
        jobList()
    },[personId]);

    async function saveJob(c: React.SubmitEvent){
        c.preventDefault();
        const response = await fetch(`/api/physical/save/employment`,{
            method : "POST",
            headers : {
                "content-type":"application/json"
            },
            body : JSON.stringify({
                ...workPlace,
                startDate:workPlace ? workPlace.startDate.toISOString().split("T")[0] : null,
                endDate:workPlace.endDate ? workPlace.endDate.toISOString().split("T")[0] : null
            })
        });
        if(!response.ok){
            alert("nepavyko išsaugoti darbovietės");
            return;
        }
        const result =await response.json();
        console.log("issaugotas darbas: ",result);
        jobList();
    }

    return (
        <>
        <h1 className={styles.title}>Darbingumas</h1>
        <table className={styles.tableButtons}>
        <thead >
            <tr>
                <th>Darbo vieta</th>
                <th>Alga</th>
                <th>Pozicija</th>
                <th>Darbo pradzia</th>
                <th>Darbo pabaiga</th>
                <th>Tipas</th>
                <th>telefono numeris</th>
            </tr>
        </thead>
        <tbody>
        {workList.length > 0 && workList.map(job => (
            <tr key={job.id}
            >
                <td>{job.employer}</td>
                <td>{job.salary}</td>
                <td>{job.position}</td>
                <td>{job.startDate.split("T")[0]}</td>
                <td>{job.endDate ? job.endDate.split("T")[0]:"dabar dirba"}</td>
                <td>{job.post===1 ? "Pilnu etatu": job.post===0.5 ? "Dalinai" : "Kontraktinis"}</td>
                <td>{job.workphone}</td>
            </tr>
        )
          )
        }

        {workList.length == 0 && (
            <tr key={0}>
                <td>Tuščia</td>
            </tr>
        )}
        </tbody>
    </table>

    <form onSubmit={saveJob}>
        <input id = "employer" type = "text" value = {workPlace.employer} onChange={handleChange} placeholder="darbas"/>
        <input id = "salary" type = "number" value = {workPlace.salary || ""} onChange={handleChange} placeholder="Alga"/>
        <input id ="position" type = "text" value = {workPlace.position} onChange={handleChange} placeholder="pozicija"/>
        <select id="post" onChange={handleChange}>
            <option value = "1" selected>Pilnu Etatu</option>
            <option value = "0.5">Dalinai</option>
            <option value = "0">Kontraktinis</option>
        </select>
        {/* <input id ="post" type = "number" value = {workPlace.post || ""} onChange={handleChange} placeholder="tipas"/> */}
        <input id = "workphone" type="text" value = {workPlace.workphone} onChange={handleChange}placeholder="darbo vietos numeris"/>
         <label>Darbo pradžia<input id = "startDate" type="date" value = {workPlace.startDate.toISOString().split("T")[0]} onChange={handleChange}/></label>
        <label>Darbo pabaiga - tuščia, dar dirba<input id ="endDate" type = "date" value ={workPlace.endDate ? workPlace.endDate.toISOString().split("T")[0]:""} onChange={handleChange}/></label>
       
        <button type = "submit">Prideti</button>
    </form>
    </>
    )
}
function CreditHistory({personId}:any){
    interface creditForm{
        personId : number,
        amount : number,
        interestRate : number,
        issuedDate : Date,
        dueDate : Date,
        status : string,
        type : string,
        latePaymentCount: number
    }
    interface creditFormForList{
        id : number,
        amount : number,
        interestRate : number,
        issuedDate : string,
        dueDate : string,
        status : string,
        type : string,
        latePaymentCount:number
    }
    const [creditForm,setCreditForm] = useState<creditForm>({
        personId :personId,
        amount : 0,
        interestRate: 0,
        issuedDate: new Date(),
        dueDate: new Date(),
        status :"ACTIVE",
        type : "SHORT_TERM",
        latePaymentCount: 0
    });
    const [creditList,setCreditList] = useState<creditFormForList[]>([]);
    const handleChange = (c: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const {id, value, type} = c.target;
        let finalValue: any = value;
        
        if(type ==='number') {
            finalValue = Number(value);
        }
        else if(type ==='date'){
            finalValue = new Date(value);
        }


        setCreditForm({
            ...creditForm,
            [id] :finalValue
        });
    }
     const fetchData = async () =>{
            const response = await fetch(`/api/physical/get/${personId}/credits`, {
            });
            if(!response.ok){
                console.log("nepavyko gauti kredito saraso")
                return;
            }
            const data = await response.json();
            setCreditList(data);
        }
    useEffect(()=> {
        fetchData()
    },[personId]);
    useEffect(()=>{
        setCreditForm(prev=> ({
            ...prev,
            personId:personId
        }));
    },[personId]);
    async function saveCreditForm(e: React.SubmitEvent) {
        e.preventDefault();
        const response = await fetch ("/api/physical/import/credit", {
            method: "POST",
            headers: {
                "content-Type" : "application/json"
            },
            body : JSON.stringify({
                ...creditForm,
                issuedDate: creditForm.issuedDate.toISOString().split("T")[0],
                dueDate: creditForm.dueDate.toISOString().split("T")[0]
                })
         });
        if(!response.ok){
            console.log("nepavyko išsaugoti kredito informacijos");
            return;
        }
        console.log("sukurem su id: ",response.text());
        fetchData();
    }
    return (
        <>
        <h1 className={styles.title}>Paskolos</h1>
        <table className={styles.tableButtons}>
        <thead >
            <tr>
                <th>Suma</th>
                <th>palukanos</th>
                <th>isdavimo data</th>
                <th>pabaigos data</th>
                <th>statusas</th>
                <th>tipas</th>
                <th>Vėlavimai</th>
            </tr>
        </thead>
        <tbody>
        {creditList.length > 0 && creditList.map(credit => (
            <tr key={credit.id}
            >
                <td>{credit.amount}</td>
                <td>{credit.interestRate}</td>
                <td>{credit.issuedDate.split("T")[0]}</td>
                <td>{credit.dueDate.split("T")[0]}</td>
                <td>{credit.status}</td>
                <td>{credit.type}</td>
                <td>{credit.latePaymentCount}</td>
            </tr>
        )
          )
        }

        {creditList.length == 0 && (
            <tr key={0}>
                <td>Tuščia</td>
            </tr>
        )}
        </tbody>
    </table>
    
        <form onSubmit={saveCreditForm}>
            <input type = "number" id = "amount" placeholder="suma" value={creditForm.amount||""} onChange={handleChange}/>
            <input type = "number" id = "interestRate" placeholder="palukanu %" value = {creditForm.interestRate || ""} onChange={handleChange}/>
            <input type = "number" id = "latePaymentCount" placeholder="Velavimų sumokėti skaičius" value = {creditForm.latePaymentCount || ""} onChange={handleChange}/>

            <label>Išdavimo data<input type ="date" id = "issuedDate" value = {creditForm.issuedDate.toISOString().split("T")[0]} onChange={handleChange}/></label>
            <label>Pabaigos data<input type ="date" id = "dueDate" value = {creditForm.dueDate.toISOString().split("T")[0]} onChange={handleChange}/></label>
            <select id = "status" value = {creditForm.status} onChange={handleChange}>
                <option value="ACTIVE">Aktyvus</option>
                <option value ="PAID">Baigtas</option>
                <option value = "DEFAULTED">Nevykdytas</option>
            </select>
            <select id = "type" value = {creditForm.type} onChange={handleChange}>
                <option value = "SHORT_TERM">trumpalaikis</option>
                <option value = "LONG_TERM">ilgalaikis</option>
            </select>
            <button type = "submit">Prideti</button>
        </form>
        </>
    )
}
function Documents({personId}: any){
    console.log("personId:", personId);
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
                const res = await fetch(`/api/physical/get/${personId}/documents`);
                if(res.ok){
                    const data = await res.json();
                    setDocuments(data);
                }
        };
        const uploadDocument = async (file: File)=> {
            const formData = new FormData();
            formData.append("personId",personId.toString());
            formData.append("file",file);
            const res = await fetch("/api/physical/upload/document", {
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

function EditProfile({id}: any){

    interface PersonProfile1 {
        id: number,
        citizenId: string;
        fullname: string;
        telephone: string;
        email: string;
        country: string;
        region: string;
        city: string;
        zipcode: string;
        birthday: Date;
        sex: string;
        homeStatus: string;
    }

    const [personProfile1, setPersonProfile1] = useState<PersonProfile1>({
        id: 0,
        citizenId: "",
        fullname: "",
        telephone: "",
        email: "",
        country: "",
        region: "",
        city: "",
        zipcode: "",
        birthday: new Date(),
        sex: "OTHER",
        homeStatus: "NONE",
    });

    useEffect(() => {
        fetch(`/api/physical/get/${id}`, {method: "GET", credentials: "include"}).then(
            response => response.json()
        ).then(
            data => setPersonProfile1({...data, birthday: new Date(data.birthday)})
        ).catch(
            exception => alert(exception)
        );
    }, [id])

    //--------------------------------------------------------------------------------------------------------------------------

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setPersonProfile1(prev => ({...prev, [name]: type === "date" ? new Date(value) : type === "number" ? Number(value) : value}));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPersonProfile1(prev => ({ ...prev, [name]: value }));
    };

    const getDisplayValue = (name: keyof PersonProfile1, type: string) => {
        const val = personProfile1[name];
        if (type === "date" && val instanceof Date) return val.toISOString().split("T")[0];
        return String(val);
    };

    async function updateProfile(){
        const response = await fetch(`/api/physical/update`, {method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify(personProfile1), credentials: "include"});
        if(response.ok){
            alert("Pakeista");
        }
        else {
            alert("Nepavyko pakeisti asmens duomenų");
        }
        return;
    }

    async function deleteProfile(){
        const response = await fetch(`/api/physical/delete/${id}`, {method: "DELETE", credentials: "include"});
        const data = await response.text();
        if(response.ok && Number(data) == id){
            alert("Istrinta");
            window.location.replace("/dashboard/portfolio");
        }
        else{
            alert("Nepavyko");
        }
    }

    //--------------------------------------------------------------------------------------------------------------------------

    const FIELDS: { name: keyof PersonProfile1; label: string; type: string; options?: {value: string; label2: string}[] }[] = [
        { name: "citizenId",          label: "Asmens kodas",     type: "disabledText" },
        { name: "fullname",    label: "Vardas pavardė",   type: "text"   },
        { name: "telephone",   label: "Telefono numeris",  type: "text"   },
        { name: "email",       label: "Elektroninis paštas",  type: "text"   },
        { name: "country",    label: "Šalis",             type: "text"   },
        { name: "region",     label: "Regionas",          type: "text"   },
        { name: "city",       label: "Miestas",           type: "text"   },
        { name: "zipcode",    label: "Pašto kodas",       type: "text" },
        { name: "birthday",   label: "Gimimo data",       type: "date"   },
        { name: "sex",        label: "Lytis",             type: "select", options: [{value:"MALE", label2:"Vyras"}, {value:"FEMALE", label2:"Moteris"}, {value:"OTHER", label2:"Kita"}]},
        { name: "homeStatus", label: "Namų statusas",     type: "select", options: [{value:"NONE", label2:"Nėra"}, {value:"RENTING", label2:"Nuomojasi"}, {value:"MORTGAGE", label2:"Išsiperka"}, {value:"OWNER", label2:"Turi"}]},
    ];

    //--------------------------------------------------------------------------------------------------------------------------
    return (
        <div className={""}>
                <h1 className={styles.title}>Asmens Profilis</h1>
                <div className={styles.profileOptions}>
                    {FIELDS.map(({ name, label, type, options}) => (
                        <div key={name}>
                            <label htmlFor={name}>{label}</label>
                            { type === "select" ? (
                            <select id={name} name={name} value={getDisplayValue(name, type)} onChange={handleSelectChange}>
                                {options!.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label2}</option>
                                ))}
                            </select>
                            ) : 
                            type === "disabledText" ? (
                                <input id={name} name={name} type={type} value={getDisplayValue(name, type)} disabled/>
                            ) : (
                                <input id={name} name={name} type={type} value={getDisplayValue(name, type)} onChange={handleChange}/>
                            )
                            }
                        </div>
                    ))}
                    <div className={styles.buttonDiv}>
                        <button onClick={ updateProfile }>Išsaugoti pakeitimus</button>
                        <button onClick={ deleteProfile }>Ištrinti</button>
                    </div>
                </div>
            </div>
    )
}


export default PhysicalProfiles