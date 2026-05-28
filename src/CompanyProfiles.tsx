import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import styles from "./CompanyProfiles.module.css";
import g_styles from "./Components/general_style.module.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
function CompanyProfiles() {
  const { state } = useLocation();
  const { id } = state || {};

  if (!id)
    return (
      <div className={g_styles.page_wrapper}>
        <p>Nėra pasirinktos įmonės</p>
      </div>
    );

  return (
    <div className={g_styles.page_wrapper}>
      <div className={g_styles.card}>
        <h1 className={g_styles.card_title}>Juridinis Asmuo</h1>

        <div className={styles.profileGrid}>
          <div className={styles.card}>
            <EditProfile id={id} />
          </div>
          <div className={styles.card}>
            <Rating id={id} />
          </div>
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <InputRatingInformation id={id} />
          </div>
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <Documents id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EditProfile({ id }: { id: number }) {
  interface Profile {
    id: number;
    companyId: string;
    name: string;
    email: string;
    telephone: string;
    ownerFullname: string;
  }

  const [company, setCompany] = useState<Profile>({
    companyId: "",
    name: "",
    email: "",
    telephone: "",
    ownerFullname: "",
    id: 0,
  });

  useEffect(() => {
    setCompany((prev) => ({ ...prev, id }));
  }, [id]);

  useEffect(() => {
    fetch(`/api/juridical/get/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCompany(data))
      .catch(() => console.error("Nepavyko gauti įmonės"));
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCompany((prev) => ({ ...prev, [id]: value }));
  };

  const saveData = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/juridical/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    });
    res.ok ? alert("Duomenys išsaugoti") : alert("Nepavyko išsaugoti");
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>Profilis</h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="companyId">
            Įmonės kodas
          </label>
          <input
            className={styles.inputField}
            id="companyId"
            type="text"
            value={company.companyId}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">
            Įmonės pavadinimas
          </label>
          <input
            className={styles.inputField}
            id="name"
            type="text"
            value={company.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">
            El. paštas
          </label>
          <input
            className={styles.inputField}
            id="email"
            type="email"
            value={company.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="telephone">
            Telefono numeris
          </label>
          <input
            className={styles.inputField}
            id="telephone"
            type="tel"
            value={company.telephone}
            onChange={handleChange}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel} htmlFor="ownerFullname">
            Įmonės atstovo pilnas vardas
          </label>
          <input
            className={styles.inputField}
            id="ownerFullname"
            type="text"
            value={company.ownerFullname}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.buttonDiv}>
        <button
          className={styles.calculateButton}
          onClick={saveData}
          type="button"
        >
          Išsaugoti pakeitimus
        </button>
        <button className={styles.dangerButton} type="button">
          Ištrinti
        </button>
      </div>
    </>
  );
}

function Rating({ id }: { id: number }) {
  interface RatingData {
    totalScore: number;
    quickLiquidityRatio: number;
    interestCoverage: number;
    netDebtRatio: number;
    netProfitability: number;
    changeInSalesRevenue: number;
    equityRatio: number;

    quickLiquidityPoints: number;
    equityRatioPoints: number;
    interestCoveragePoints: number;
    netDebtRatioPoints: number;
    netProfitabilityPoints: number;
    salesRevenuePoints: number;
  }

  const [evalu, setEvalu] = useState<RatingData>({
    totalScore: 0,
    quickLiquidityRatio: 0,
    interestCoverage: 0,
    netDebtRatio: 0,
    netProfitability: 0,
    changeInSalesRevenue: 0,
    equityRatio: 0,

    quickLiquidityPoints: 0,
    equityRatioPoints: 0,
    interestCoveragePoints: 0,
    netDebtRatioPoints: 0,
    netProfitabilityPoints: 0,
    salesRevenuePoints: 0,
  });
  const waterfallData = [
    {
      name: "Likvidumas",
      value: evalu.quickLiquidityPoints,
    },
    {
      name: "Nuosavybė",
      value: evalu.equityRatioPoints,
    },
    {
      name: "Palūkanos",
      value: evalu.interestCoveragePoints,
    },
    {
      name: "Skolos",
      value: evalu.netDebtRatioPoints,
    },
    {
      name: "Pelningumas",
      value: evalu.netProfitabilityPoints,
    },
    {
      name: "Pajamos",
      value: evalu.salesRevenuePoints,
    },
  ];
  const [grade, setGrade] = useState("-");
  const [gradeInfo, setGradeInfo] = useState("-");

  const fetchRating = async () => {
    const res = await fetch(`/api/juridical/get/${id}/scores`);
    if (res.ok) {
      const data = await res.json();
      setEvalu(data);
    }
  };

  useEffect(() => {
    fetchRating();
  }, [id]);

  useEffect(() => {
    const s = evalu.totalScore;
    if (s >= 900) {
      setGrade("A");
      setGradeInfo("Labai aukštas patikimumas");
    } else if (s >= 800) {
      setGrade("B");
      setGradeInfo("Aukštas patikimumas");
    } else if (s >= 600) {
      setGrade("C");
      setGradeInfo("Vidutinis patikimumas");
    } else if (s >= 400) {
      setGrade("D");
      setGradeInfo("Žemas patikimumas");
    } else {
      setGrade("E");
      setGradeInfo("Labai žemas patikimumas");
    }
  }, [evalu.totalScore]);

  return (
    <>
      <h2 className={styles.sectionTitle}>Reitingas</h2>
      <div className={styles.resultsCard}>
        <div className={styles.ratingSummary}>
          <div className={styles.totalScore}>{evalu.totalScore.toFixed(2)}</div>
          <div className={styles.gradeBlock}>
            <div className={styles.ratingGrade}>{grade}</div>
            <div className={styles.gradeInfo}>{gradeInfo}</div>
          </div>
        </div>
      </div>
      <div className={styles.scoreBreakdown}>
        <div className={styles.scoreItem}>
          <span>Greitas likvidumo koef.</span>
          <span>{evalu.quickLiquidityRatio}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>Palūkanų padengimas</span>
          <span>{evalu.interestCoverage}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>Paskolų ir EBIT santykis</span>
          <span>{evalu.netDebtRatio}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>Grynasis pelningumas</span>
          <span>{evalu.netProfitability}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>Pardavimų pajamų pokytis</span>
          <span>{evalu.changeInSalesRevenue}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>Nuosavybės koeficientas</span>
          <span>{evalu.equityRatio}</span>
        </div>
      </div>
      <div style={{ width: "100%", height: 220, marginTop: "20px" }}>
        <ResponsiveContainer>
          <BarChart data={waterfallData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 170]} />
            <Tooltip />

            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.value >= 140
                      ? "#bfd4f7"
                      : entry.value >= 100
                        ? "#909fb9"
                        : entry.value >= 50
                          ? "#bea784"
                          : "#cc7f7f"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button
        className={styles.calculateButton}
        onClick={fetchRating}
        type="button"
      >
        Perskaičiuoti vertinimą
      </button>
    </>
  );
}

function InputRatingInformation({ id }: { id: number }) {
  interface RatingData {
    shortTermAssets: number;
    inventory: number;
    shortTermLiabilities: number;
    equity: number;
    totalAssets: number;
    netProfit: number;
    interest: number;
    taxes: number;
    financialLiabilities: number;
    cash: number;
    depreciation: number;
    amortization: number;
    salesRevenueCurrent: number;
    salesRevenue1YearOld: number;
    companyId: number;
  }

  const [companyData, setCompanyData] = useState<RatingData>({
    shortTermAssets: 0,
    inventory: 0,
    shortTermLiabilities: 0,
    equity: 0,
    totalAssets: 0,
    netProfit: 0,
    interest: 0,
    taxes: 0,
    financialLiabilities: 0,
    cash: 0,
    depreciation: 0,
    amortization: 0,
    salesRevenueCurrent: 0,
    salesRevenue1YearOld: 0,
    companyId: id,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [id]: value === "" ? 0 : Number(value),
    }));
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  function fetchData(){
    setCompanyData((prev) => ({ ...prev, companyId: id }));
    fetch(`/api/juridical/get/data/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCompanyData(data))
      .catch(() => console.error("Nepavyko paimti finansinių duomenų"));
  }
  const saveData = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/juridical/update/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    });
    res.ok
      ? alert("Sėkmingai išsaugoti duomenys")
      : alert("Nepavyko išsaugoti");
  };

  const readPdf = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      `/api/juridical/read/data/${companyData.companyId}`,
    );
    res.ok
      ? (alert("Dokumentas nuskaitytas"), fetchData())
      : alert("Nepavyko nuskaityti dokumento");
  };

  const fields = [
    { id: "shortTermAssets", label: "Trumpalaikis turtas" },
    { id: "inventory", label: "Atsargos" },
    { id: "shortTermLiabilities", label: "Trumpalaikiai įsipareigojimai" },
    { id: "equity", label: "Nuosavas kapitalas" },
    { id: "totalAssets", label: "Visas turtas" },
    { id: "netProfit", label: "Grynas pelnas" },
    { id: "interest", label: "Palūkanos" },
    { id: "taxes", label: "Sumokėti mokesčiai" },
    { id: "depreciation", label: "Nusidėvėjimas" },
    { id: "amortization", label: "Amortizacija" },
    { id: "financialLiabilities", label: "Finansiniai įsipareigojimai" },
    { id: "cash", label: "Grynieji pinigai" },
    { id: "salesRevenueCurrent", label: "Pardavimų pajamos (naujausi metai)" },
    { id: "salesRevenue1YearOld", label: "Pardavimų pajamos (praeiti metai)" },
  ];

  return (
    <>
      <h2 className={styles.sectionTitle}>Finansiniai duomenys</h2>
      <form onSubmit={saveData} className={styles.formGrid}>
        {fields.map((f) => (
          <div className={styles.formGroup} key={f.id}>
            <label className={styles.formLabel} htmlFor={f.id}>
              {f.label}
            </label>
            <input
              className={styles.inputField}
              id={f.id}
              type="number"
              value={companyData[f.id as keyof RatingData] || ""}
              onChange={handleChange}
              placeholder={f.label}
            />
          </div>
        ))}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <button type="submit" className={styles.calculateButton}>
            Išsaugoti
          </button>
        </div>
      </form>
      <form onSubmit={readPdf} style={{ marginTop: "1rem" }}>
        <button type="submit" className={styles.secondaryButton}>
          Nuskaityti duomenis iš dokumento
        </button>
      </form>
    </>
  );
}

function Documents({ id }: { id: number }) {
  interface Doc {
    id: number;
    filename: string;
    originalName: string;
  }
  const [documents, setDocuments] = useState<Doc[]>([]);

  const fetchDocuments = async () => {
    const res = await fetch(`/api/juridical/get/${id}/documents`);
    if (res.ok) setDocuments(await res.json());
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append("companyId", id.toString());
    formData.append("file", file);
    const res = await fetch("/api/juridical/upload/document", {
      method: "POST",
      body: formData,
    });
    if (res.ok) fetchDocuments();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadDocument(file);
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>Dokumentai</h2>
      <div className={styles.documentList}>
        {documents.map((doc) => (
          <div key={doc.id} className={styles.documentItem}>
            <span>{doc.originalName}</span>
            <a
              href={`/api/physical/get/document/${doc.id}`}
              className={styles.downloadLink}
            >
              Atsiųsti
            </a>
          </div>
        ))}
      </div>
      <button className={styles.calculateButton} style={{ marginTop: "1rem" }}>
        <label style={{ cursor: "inherit" }}>
          Įkelti naują failą
          <input type="file" hidden onChange={handleFileChange} />
        </label>
      </button>
    </>
  );
}

export default CompanyProfiles;
