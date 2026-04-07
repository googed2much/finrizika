import { useEffect, useState } from "react";
import styles from "./Portfolio.module.css"
import { useNavigate } from "react-router-dom"
// import Modal from "./Components/Modal";
import PhysicalCreation from "./PhysicalCreation";
import CompanyProfiles from "./CompanyProfiles";
import Modal from "./Components/Modal";


function Portfolio() {
    const [viewType,setViewType] = useState<"physical"|"juridical">("physical");
        
    const [showPhysModal,setPhysModal] = useState(false);
    const [showJurModal,setJurModal] = useState(false);
    return (
        <>
             <div className={styles.backgroundColor}>
        <div className={styles.profileBox}>
            
            <h1>Portfelis</h1>
            
            <p className={styles.subtitle}>Saugomų asmenų duomenys</p>
            
            <div className={styles.tabs}>
                <button
                    className={viewType === "physical" ? styles.activeTab : ""}
                    onClick={() => setViewType("physical")}
                >
                    Fiziniai Asmenys
                </button>

                <button
                    className={viewType === "juridical" ? styles.activeTab : ""}
                    onClick={() => setViewType("juridical")}
                >
                    Juridiniai Asmenys
                </button>
            </div>

        <div className={styles.content}>
            {viewType === "physical" && <PhysicalIndividual setPhysModal={setPhysModal} />}
            {viewType === "juridical" && <JuridicalIndividual setJurModal = {setJurModal} />}
        </div>
          </div>
          </div>
          <Modal isOpen={showPhysModal} onClose={()=>setPhysModal(false)}><PhysicalCreation/></Modal>
          <Modal isOpen={showJurModal} onClose={()=>setJurModal(false)}><CompanyProfiles/></Modal>
        </>
    )
}

function PhysicalIndividual({setPhysModal}: {setPhysModal:(v:boolean)=>void}){
    const [page,setPage] = useState<number>(0);
    function changePage(number : number){
        if(number<0 && page<1) return;
        if(number==0) {setPage(0);return;}
        if(number==2) {setPage(lastPage);return;}
        if(number>0 && page==lastPage) return;
        setPage(page+number);
    }
    
    useEffect(()=>{
        searchProfile("");
    },[page]);
    const [lastPage,setLastPage] = useState<number>(0);
    useEffect(()=>{
        const fetchPageInfo = async ()=>{
            const response = await fetch(`/api/physical/get/pages`);  
            if(!response.ok){
                console.error("nepavyko gauti page info");
                return;
            }
            const data = await response.json();
            setLastPage(data);
            console.log("gautas last page : ",data);
        };
        fetchPageInfo();   
    },[]);
    interface Person {
        citizenId : string, 
        id: number;
        fullname: string;
        telephone: string;
        email: string;
    }
    const navigate = useNavigate();
    const [personID, setPersonID] = useState<string>("");
    const [filteredIndividuals,setFilteredIndividuals] = useState<Person[]>([]);
    useEffect(()=>{
        searchProfile("");
    }, []);
    async function searchProfile(physicalId: any) {
        if (physicalId === "") {
            const response = await fetch(`/api/physical/get/list/${page}`)
            if (response.ok) {
                const data = await response.json();
                setFilteredIndividuals(data);
            }
            return;
        
        }
        else {
            const response = await fetch(
                `/api/physical/get/by/${physicalId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );
        
              if (!response.ok) {
                console.error("Failed to get physical person");
                return;
              }
              const data: Person = await response.json();
              setFilteredIndividuals([data]);
        }
    }
    
    return (
        <div className={styles.profileBox}>
            <div className={styles.toolbar}>
                <input type="number" min={1} step={1} placeholder="Paieška.. įveskite kodą" value={personID} onChange={e => {setPersonID(e.target.value);searchProfile(e.target.value)}}></input>
                <button  onClick={()=>{setPhysModal(true)}} className={styles.link}>Sukurti naują profilį</button>
            </div>
    <h3 className={styles.title}>Fizinių asmenų sąrašas</h3>
    <table>
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
            onClick={() => navigate("/dashboard/physical-profile", { state: { id: individual.id } })}
            >
                <td>{individual.citizenId}</td>
                <td>{individual.fullname}</td>
                <td>{individual.telephone}</td>
                <td>{individual.email}</td>
            </tr>
        )
        )
        }

        {filteredIndividuals.length == 0 && (
            <tr key={0}>
                <td>Tuščia</td>
            </tr>
        )}
        </tbody>
    </table>
    <div className={styles.pagination}>
        <button id = "firstPageBtn" onClick={()=>changePage(0)}>Pirmas</button>
        <button id = "pageBtnMinus" onClick={()=>changePage(-1)}>Praeitas</button>
        <button id = "pageBtnPlus">{page+1}</button>
        <button id = "pageBtnPlus" onClick={()=>changePage(1)}>Kitas</button>
        <button id = "lastpageBtn" onClick={()=>changePage(2)}>Paskutinis</button>
    </div>
    </div>
    )
    
}
function JuridicalIndividual({setJurModal} : {setJurModal : (v:boolean)=>void}){
    const [page,setPage] = useState<number>(0);
    function changePage(number : number){
        if(number<0 && page<1) return;
        if(number==0) {setPage(0);return;}
        if(number==2) {setPage(lastPage);return;}
        if(number>0 && page==lastPage) return;
        setPage(page+number);
    }
    useEffect(()=>{
        searchProfile("");
    },[page]);
    interface Company {
        companyId: number;     
        ownerFullname: string;
        telephone: string;
        email: string;
        name : string;
        id: string;
    }
    const [lastPage,setLastPage] = useState<number>(0);
    useEffect(()=>{
        const fetchPageInfo = async ()=>{
            const response = await fetch(`/api/juridical/get/pages`);  
            if(!response.ok){
                console.error("nepavyko gauti page info");
                return;
            }
            const data = await response.json();
            setLastPage(data);
            console.log("gautas last page : ",data);
        };
        fetchPageInfo();   
    },[]);
      const navigate = useNavigate();
      const [searchCompanyCode, setSearchCompanyCode] = useState<string>("");
      const [companies, setCompanies] = useState<Company[]>([]);
      async function searchProfile(companyCode: any) {
        if (companyCode === "") {
          const response = await fetch(
            `/api/juridical/get/list/${page}`,
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
            `/api/juridical/get/by/${companyCode}`,
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
          const data = await response.json();
          setCompanies([data]);
        }
    }
    
    useEffect(() => {
        searchProfile("");
    }, []);
    return (
        <div className={styles.profileBox}>

            <div className={styles.toolbar}>
            <input type="number" min={1} step={1} placeholder="Paieška.. įveskite kodą" value={searchCompanyCode} onChange={e => {setSearchCompanyCode(e.target.value);searchProfile(e.target.value);}}></input>
            <button onClick={()=>setJurModal(true)} className={styles.link}>Sukurti naują profilį</button>
            </div>
            <h3 className={styles.title}>Juridiniu asmenu sąrašas</h3>
            
            <table className={styles.tableButtons}>
        <thead>
          <tr className={styles.company_table_thead}>
            <th>Įmonės kodas</th>
            <th>Pavadinimas</th>
            <th>Telefono numeris</th>
            <th>El.Paštas</th>
            <th>Atstovas</th>
          </tr>
        </thead>

        {companies.length > 0 && (
          <tbody>
            {companies.map((company, index) => (
            <tr key={`${index}`}
            onClick={() => navigate("/dashboard/juridical-profile", { state: { id: company.id } })}
            >
                <td>{company.companyId}</td>
                <td>{company.ownerFullname}</td>
                <td>{company.telephone}</td>
                <td>{company.email}</td>
                <td>{company.ownerFullname}</td>
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
      <div className={styles.pagination}>
        
        <button id = "firstPageBtn" onClick={()=>changePage(0)}>Pirmas</button>
        <button id = "pageBtnMinus" onClick={()=>changePage(-1)}>Praeitas</button>
        <button id = "pageBtnPlus">{page+1}</button>
        <button id = "pageBtnPlus" onClick={()=>changePage(1)}>Kitas</button>
        <button id = "lastpageBtn" onClick={()=>changePage(2)}>Paskutinis</button>
    </div>
        </div>
    )
}
export default Portfolio