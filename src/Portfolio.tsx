import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import g_styles from "./Components/general_style.module.css";
import styles from "./Portfolio.module.css";
import PhysicalCreation from "./PhysicalCreation";
import CompanyProfiles from "./CompanyCreation";
import Modal from "./Components/Modal";

interface Person {
  id: number;
  citizenId: string;
  fullname: string;
  telephone: string;
  email: string;
}

interface Company {
  companyId: number;
  ownerFullname: string;
  telephone: string;
  email: string;
  name: string;
  id: string;
}

function Portfolio() {
  const [viewType, setViewType] = useState<"physical" | "juridical">(
    "physical",
  );
  const [showPhysModal, setPhysModal] = useState(false);
  const [showJurModal, setJurModal] = useState(false);

  return (
    <div className={g_styles.page_wrapper}>
      <div className={g_styles.card}>
        <h1 className={g_styles.card_title}>Portfelis</h1>
        <p className={styles.subtitle}>Saugomų asmenų duomenys</p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${viewType === "physical" ? styles.active : ""}`}
            onClick={() => setViewType("physical")}
            type="button"
          >
            Fiziniai Asmenys
          </button>
          <button
            className={`${styles.tab} ${viewType === "juridical" ? styles.active : ""}`}
            onClick={() => setViewType("juridical")}
            type="button"
          >
            Juridiniai Asmenys
          </button>
        </div>

        <div className={styles.content}>
          {viewType === "physical" && (
            <PhysicalIndividual setPhysModal={setPhysModal} />
          )}
          {viewType === "juridical" && (
            <JuridicalIndividual setJurModal={setJurModal} />
          )}
        </div>
      </div>

      <Modal isOpen={showPhysModal} onClose={() => setPhysModal(false)}>
        <PhysicalCreation />
      </Modal>
      <Modal isOpen={showJurModal} onClose={() => setJurModal(false)}>
        <CompanyProfiles />
      </Modal>
    </div>
  );
}

function PhysicalIndividual({
  setPhysModal,
}: {
  setPhysModal: (v: boolean) => void;
}) {
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [personID, setPersonID] = useState("");
  const [filteredIndividuals, setFilteredIndividuals] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async (searchId: string, currentPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const pagesRes = await fetch("/api/physical/get/pages", {
        credentials: "include",
      });
      if (!pagesRes.ok) throw new Error("Failed to fetch pages");
      const pages = await pagesRes.json();
      setLastPage(pages);

      const url = searchId
        ? `/api/physical/get/by/${searchId}`
        : `/api/physical/get/list/${currentPage}`;

      const dataRes = await fetch(url, { credentials: "include" });
      if (!dataRes.ok) throw new Error("Failed to fetch data");
      const data = await dataRes.json();

      setFilteredIndividuals(
        Array.isArray(data) ? data : [data].filter(Boolean),
      );
    } catch (err) {
      console.error("Nepavyko gauti duomenų", err);
      setError(
        "Nepavyko užkrauti duomenų. Patikrinkite ryšį ir bandykite dar kartą.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData("", 0);
  }, []);
  useEffect(() => {
    if (!personID) fetchData("", page);
  }, [page]);

  const handleSearch = (value: string) => {
    setPersonID(value);
    fetchData(value, 0);
  };

  const changePage = (step: number) => {
    if (step === 0) setPage(0);
    else if (step === 2) setPage(lastPage);
    else if (step < 0 && page > 0) setPage(page - 1);
    else if (step > 0 && page < lastPage) setPage(page + 1);
  };

  return (
    <div>
      <div className={g_styles.controls_div}>
        <input
          type="text"
          placeholder="Paieška.. įveskite asmens kodą"
          value={personID}
          onChange={(e) => handleSearch(e.target.value)}
          className={g_styles.input}
        />
        <button
          onClick={() => setPhysModal(true)}
          className={g_styles.button_primary}
          type="button"
        >
          + Sukurti naują profilį
        </button>
        <button
            onClick={() => navigate("/dashboard/physical-analysis")}
            className={g_styles.button_primary}
            type="button"
          >
            Portfelio Analizė
          </button>
      </div>

      {isLoading && (
        <div className={`${g_styles.message} ${g_styles.message_info}`}>
          Kraunami duomenys...
        </div>
      )}
      {error && (
        <div className={`${g_styles.message} ${g_styles.message_error}`}>
          {error}
        </div>
      )}

      <h3 className={styles.section_heading}>Fizinių asmenų sąrašas</h3>

      <div className={g_styles.table_container}>
        <table className={g_styles.table}>
          <thead>
            <tr>
              <th>Asmens kodas</th>
              <th>Pilnas vardas</th>
              <th>Telefonas</th>
              <th>El. paštas</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndividuals.length > 0 ? (
              filteredIndividuals.map((p) => (
                <tr
                  key={p.id}
                  onClick={() =>
                    navigate("/dashboard/physical-profile", {
                      state: { id: p.id },
                    })
                  }
                  className={styles.clickableRow}
                >
                  <td>{p.citizenId}</td>
                  <td>{p.fullname}</td>
                  <td>{p.telephone}</td>
                  <td>{p.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={g_styles.empty_state}>
                  {personID ? "Nerasta rezultatų" : "Sąrašas tuščias"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !error && filteredIndividuals.length > 0 && (
        <div className={g_styles.actions}>
          <button
            className={g_styles.button_secondary}
            onClick={() => changePage(0)}
            disabled={page === 0}
            type="button"
          >
            Pirmas
          </button>
          <button
            className={g_styles.button_secondary}
            onClick={() => changePage(-1)}
            disabled={page === 0}
            type="button"
          >
            ← Ankstesnis
          </button>
          <span className={styles.pageInfo}>
            Puslapis {page + 1} iš {lastPage + 1}
          </span>
          <button
            className={g_styles.button_secondary}
            onClick={() => changePage(1)}
            disabled={page === lastPage}
            type="button"
          >
            Kitas →
          </button>
          <button
            className={g_styles.button_secondary}
            onClick={() => changePage(2)}
            disabled={page === lastPage}
            type="button"
          >
            Paskutinis
          </button>
        </div>
      )}
    </div>
  );
}

function JuridicalIndividual({
  setJurModal,
}: {
  setJurModal: (v: boolean) => void;
}) {
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [companyCode, setCompanyCode] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async (searchCode: string, currentPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const pagesRes = await fetch("/api/juridical/get/pages", {
        credentials: "include",
      });
      if (!pagesRes.ok) throw new Error("Failed to fetch pages");
      const pages = await pagesRes.json();
      setLastPage(pages);

      const url = searchCode
        ? `/api/juridical/get/by/${searchCode}`
        : `/api/juridical/get/list/${currentPage}`;

      const dataRes = await fetch(url, { credentials: "include" });
      if (!dataRes.ok) throw new Error("Failed to fetch data");
      const data = await dataRes.json();

      setCompanies(Array.isArray(data) ? data : [data].filter(Boolean));
    } catch (err) {
      console.error("Nepavyko gauti duomenų", err);
      setError(
        "Nepavyko užkrauti duomenų. Patikrinkite ryšį ir bandykite dar kartą.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData("", 0);
  }, []);
  useEffect(() => {
    if (!companyCode) fetchData("", page);
  }, [page]);

  const handleSearch = (value: string) => {
    setCompanyCode(value);
    fetchData(value, 0);
  };

  const changePage = (step: number) => {
    if (step === 0) setPage(0);
    else if (step === 2) setPage(lastPage);
    else if (step < 0 && page > 0) setPage(page - 1);
    else if (step > 0 && page < lastPage) setPage(page + 1);
  };

  return (
    <div>
      <div className={g_styles.controls_div}>
        <input
          type="text"
          placeholder="Paieška.. įveskite įmonės kodą"
          value={companyCode}
          onChange={(e) => handleSearch(e.target.value)}
          className={g_styles.input}
        />
        <button
          onClick={() => setJurModal(true)}
          className={g_styles.button_primary}
          type="button"
        >
          + Sukurti naują profilį
        </button>
          <button
            onClick={() => navigate("/dashboard/juridical-analysis")}
            className={g_styles.button_primary}
            type="button"
          >
            Portfelio Analizė
          </button>
        </div>

      {isLoading && (
        <div className={`${g_styles.message} ${g_styles.message_info}`}>
          Kraunami duomenys...
        </div>
      )}
      {error && (
        <div className={`${g_styles.message} ${g_styles.message_error}`}>
          {error}
        </div>
      )}

      <h3 className={styles.section_heading}>Juridinių asmenų sąrašas</h3>

      <div className={g_styles.table_container}>
        <table className={g_styles.table}>
          <thead>
            <tr>
              <th>Įmonės kodas</th>
              <th>Pavadinimas</th>
              <th>Telefonas</th>
              <th>El. paštas</th>
              <th>Atstovas</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((c) => (
                <tr
                  key={c.id}
                  onClick={() =>
                    navigate("/dashboard/juridical-profile", {
                      state: { id: c.id },
                    })
                  }
                  className={styles.clickableRow}
                >
                  <td>{c.companyId}</td>
                  <td>{c.name}</td>
                  <td>{c.telephone}</td>
                  <td>{c.email}</td>
                  <td>{c.ownerFullname}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={g_styles.empty_state}>
                  {companyCode ? "Nerasta rezultatų" : "Sąrašas tuščias"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !error && companies.length > 0 && (
        <div className={g_styles.actions}>
          <button
            className={g_styles.button_secondary}
            onClick={() => changePage(0)}
            disabled={page === 0}
            type="button"
          >
            Pirmas
          </button>
          <button
            className={g_styles.button_secondary}
            onClick={() => changePage(-1)}
            disabled={page === 0}
            type="button"
          >
            ← Ankstesnis
          </button>
          <span className={styles.pageInfo}>
            Puslapis {page + 1} iš {lastPage + 1}
          </span>
          <button
            className={g_styles.button_secondary}
            onClick={() => changePage(1)}
            disabled={page === lastPage}
            type="button"
          >
            Kitas →
          </button>
          <button
            className={g_styles.button_secondary}
            onClick={() => changePage(2)}
            disabled={page === lastPage}
            type="button"
          >
            Paskutinis
          </button>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
