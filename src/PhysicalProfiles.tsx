import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import styles from "./PhysicalProfiles.module.css";
import g_styles from "./Components/general_style.module.css";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";

function PhysicalProfiles() {
  const { state } = useLocation();
  const { id } = state || {};

  if (!id)
    return (
      <div className={g_styles.page_wrapper}>
        <p>Nėra pasirinkto asmens</p>
      </div>
    );

  return (
    <div className={g_styles.page_wrapper}>
      <div className={g_styles.card}>
        <h1 className={g_styles.card_title}>Fizinis Asmuo</h1>

        <div className={styles.profileGrid}>
          <div className={styles.card}>
            <EditProfile id={id} />
          </div>
          <div className={styles.card}>
            <Rating personId={id} />
          </div>
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <Employment personId={id} />
          </div>
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <CreditHistory personId={id} />
          </div>
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <Documents personId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EditProfile({ id }: { id: number }) {
  interface PersonProfile {
    id: number;
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

  const [person, setPerson] = useState<PersonProfile>({
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
    fetch(`/api/physical/get/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setPerson({ ...data, birthday: new Date(data.birthday) }))
      .catch(() => console.error("Nepavyko gauti asmens duomenų"));
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setPerson((prev) => ({
      ...prev,
      [name]:
        type === "date"
          ? new Date(value)
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPerson((prev) => ({ ...prev, [name]: value }));
  };

  const getDisplayValue = (name: keyof PersonProfile, type: string) => {
    const val = person[name];
    if (type === "date" && val instanceof Date)
      return val.toISOString().split("T")[0];
    return String(val);
  };

  const updateProfile = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/physical/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
    res.ok ? alert("Pakeista") : alert("Nepavyko pakeisti");
  };

  const deleteProfile = async () => {
    if (!confirm("Ar tikrai norite ištrinti šį profilį?")) return;
    const res = await fetch(`/api/physical/delete/${id}`, { method: "DELETE" });
    res.ok
      ? (alert("Ištrinta"), window.location.replace("/dashboard/portfolio"))
      : alert("Nepavyko");
  };

  const FIELDS: {
    name: keyof PersonProfile;
    label: string;
    type: string;
    options?: { value: string; label2: string }[];
  }[] = [
    { name: "citizenId", label: "Asmens kodas", type: "disabledText" },
    { name: "fullname", label: "Vardas pavardė", type: "text" },
    { name: "telephone", label: "Telefono numeris", type: "text" },
    { name: "email", label: "Elektroninis paštas", type: "email" },
    { name: "country", label: "Šalis", type: "text" },
    { name: "region", label: "Regionas", type: "text" },
    { name: "city", label: "Miestas", type: "text" },
    { name: "zipcode", label: "Pašto kodas", type: "text" },
    { name: "birthday", label: "Gimimo data", type: "date" },
    {
      name: "sex",
      label: "Lytis",
      type: "select",
      options: [
        { value: "MALE", label2: "Vyras" },
        { value: "FEMALE", label2: "Moteris" },
        { value: "OTHER", label2: "Kita" },
      ],
    },
    {
      name: "homeStatus",
      label: "Namų statusas",
      type: "select",
      options: [
        { value: "NONE", label2: "Nėra" },
        { value: "RENTING", label2: "Nuomojasi" },
        { value: "MORTGAGE", label2: "Išsiperka" },
        { value: "OWNER", label2: "Turi" },
      ],
    },
  ];

  return (
    <>
      <h2 className={styles.sectionTitle}>Asmens Profilis</h2>
      <form onSubmit={updateProfile} className={styles.formGrid}>
        {FIELDS.map(({ name, label, type, options }) => (
          <div className={styles.formGroup} key={name}>
            <label className={styles.formLabel} htmlFor={name}>
              {label}
            </label>
            {type === "select" ? (
              <select
                className={styles.inputField}
                id={name}
                name={name}
                value={getDisplayValue(name, type)}
                onChange={handleSelectChange}
              >
                {options!.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label2}
                  </option>
                ))}
              </select>
            ) : type === "disabledText" ? (
              <input
                className={styles.inputField}
                id={name}
                name={name}
                type="text"
                value={getDisplayValue(name, type)}
                disabled
              />
            ) : (
              <input
                className={styles.inputField}
                id={name}
                name={name}
                type={type}
                value={getDisplayValue(name, type)}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <div
          className={`${styles.formGroup} ${styles.fullWidth} ${styles.buttonDiv}`}
        >
          <button type="submit" className={styles.calculateButton}>
            Išsaugoti pakeitimus
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={deleteProfile}
          >
            Ištrinti
          </button>
        </div>
      </form>
    </>
  );
}

function Rating({ personId }: { personId: number }) {
  interface RatingData {
    totalScore: number;
    lengthScore: number;
    salaryScore: number;
    latenessScore: number;
    dtiScore: number;
  }
  const [evalu, setEvalu] = useState<RatingData>({
    totalScore: 0,
    lengthScore: 0,
    salaryScore: 0,
    latenessScore: 0,
    dtiScore: 0,
  });
  const waterfallData = [
    {
      name: "Darbingumas",
      value: evalu.lengthScore,
    },
    {
      name: "Alga",
      value: evalu.salaryScore,
    },
    {
      name: "Vėlavimai",
      value: evalu.latenessScore,
    },
    {
      name: "DTI",
      value: evalu.dtiScore,
    },
  ];
  const [grade, setGrade] = useState("-");
  const [gradeInfo, setGradeInfo] = useState("-");

  const fetchRating = async () => {
    const res = await fetch(`/api/physical/get/${personId}/scores`);
    if (res.ok) setEvalu(await res.json());
  };

  useEffect(() => {
    fetchRating();
  }, [personId]);
  useEffect(() => {
    const s = evalu.totalScore;
    if (s >= 90) {
      setGrade("A");
      setGradeInfo("Labai aukštas patikimumas");
    } else if (s >= 80) {
      setGrade("B");
      setGradeInfo("Aukštas patikimumas");
    } else if (s >= 60) {
      setGrade("C");
      setGradeInfo("Vidutinis patikimumas");
    } else if (s >= 40) {
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
          <div className={styles.totalScore}>{evalu.totalScore}</div>
          <div className={styles.gradeBlock}>
            <div className={styles.ratingGrade}>{grade}</div>
            <div className={styles.gradeInfo}>{gradeInfo}</div>
          </div>
        </div>
      </div>
      <div className={styles.scoreBreakdown}>
        <div className={styles.scoreItem}>
          <span>DTI</span>
          <span>{evalu.dtiScore}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>Vėlavimas</span>
          <span>{evalu.latenessScore}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>Alga</span>
          <span>{evalu.salaryScore}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>Darbingumas</span>
          <span>{evalu.lengthScore}</span>
        </div>
      </div>
      <div style={{ width: "100%", height: 220, marginTop: "20px" }}>
        <ResponsiveContainer>
          <BarChart data={waterfallData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 45]} />
            <Tooltip />

            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.value >= 25
                      ? "#bfd4f7"
                      : entry.value >= 10
                        ? "#909fb9"
                        : entry.value >= 5
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

function Employment({ personId }: { personId: number }) {
  interface WorkEntry {
    id?: number;
    personId: number;
    salary: number;
    post: number;
    employer: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    workphone: string;
  }
  interface WorkListEntry {
    id: number;
    salary: number;
    post: number;
    employer: string;
    position: string;
    startDate: string;
    endDate: string;
    workphone: string;
  }

  const [workPlace, setWorkPlace] = useState<WorkEntry>({
    personId,
    salary: 0,
    post: 1,
    employer: "",
    position: "",
    startDate: new Date(),
    endDate: null,
    workphone: "",
  });
  const [workList, setWorkList] = useState<WorkListEntry[]>([]);

  useEffect(() => {
    setWorkPlace((prev) => ({ ...prev, personId }));
    fetch(`/api/physical/get/${personId}/employment`)
      .then((res) => res.ok && res.json())
      .then(setWorkList)
      .catch(() => console.error("Nepavyko gauti darboviečių"));
  }, [personId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value, type } = e.target;
    let finalValue: any = value;
    if (type === "number") finalValue = Number(value);
    else if (type === "date") finalValue = new Date(value);
    setWorkPlace((prev) => ({ ...prev, [id]: finalValue }));
  };

  const saveJob = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/physical/save/employment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...workPlace,
        startDate: workPlace.startDate.toISOString().split("T")[0],
        endDate: workPlace.endDate?.toISOString().split("T")[0] || null,
      }),
    });
    res.ok
      ? (alert("Įrašyta"),
        fetch(`/api/physical/get/${personId}/employment`)
          .then((r) => r.ok && r.json())
          .then(setWorkList))
      : alert("Nepavyko išsaugoti");
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>Darbingumas</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Darbo vieta</th>
              <th>Alga</th>
              <th>Pozicija</th>
              <th>Pradžia</th>
              <th>Pabaiga</th>
              <th>Tipas</th>
              <th>Telefonas</th>
            </tr>
          </thead>
          <tbody>
            {workList.length > 0 ? (
              workList.map((job) => (
                <tr key={job.id}>
                  <td>{job.employer}</td>
                  <td>{job.salary}€</td>
                  <td>{job.position}</td>
                  <td>{job.startDate.split("T")[0]}</td>
                  <td>{job.endDate ? job.endDate.split("T")[0] : "Dabar"}</td>
                  <td>
                    {job.post === 1
                      ? "Pilnu"
                      : job.post === 0.5
                        ? "Dalinai"
                        : "Kontraktinis"}
                  </td>
                  <td>{job.workphone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  Nėra įrašų
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={saveJob} className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="employer">
            Darbdavys
          </label>
          <input
            className={styles.inputField}
            id="employer"
            type="text"
            value={workPlace.employer}
            onChange={handleChange}
            placeholder="UAB Įmonė"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="salary">
            Alga (€)
          </label>
          <input
            className={styles.inputField}
            id="salary"
            type="number"
            value={workPlace.salary || ""}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="position">
            Pareigos
          </label>
          <input
            className={styles.inputField}
            id="position"
            type="text"
            value={workPlace.position}
            onChange={handleChange}
            placeholder="Vadybininkas"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="post">
            Užimtumas
          </label>
          <select
            className={styles.inputField}
            id="post"
            value={workPlace.post}
            onChange={handleChange}
          >
            <option value={1}>Pilnu etatu</option>
            <option value={0.5}>Dalinai</option>
            <option value={0}>Kontraktinis</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="workphone">
            Darbo telefonas
          </label>
          <input
            className={styles.inputField}
            id="workphone"
            type="tel"
            value={workPlace.workphone}
            onChange={handleChange}
            placeholder="+370 600 00000"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="startDate">
            Pradžia
          </label>
          <input
            className={styles.inputField}
            id="startDate"
            type="date"
            value={workPlace.startDate.toISOString().split("T")[0]}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="endDate">
            Pabaiga (nebūtina)
          </label>
          <input
            className={styles.inputField}
            id="endDate"
            type="date"
            value={workPlace.endDate?.toISOString().split("T")[0] || ""}
            onChange={handleChange}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <button type="submit" className={styles.calculateButton}>
            Pridėti įrašą
          </button>
        </div>
      </form>
    </>
  );
}

function CreditHistory({ personId }: { personId: number }) {
  interface CreditEntry {
    personId: number;
    amount: number;
    interestRate: number;
    issuedDate: Date;
    dueDate: Date;
    status: string;
    type: string;
    latePaymentCount: number;
  }
  interface CreditListEntry {
    id: number;
    amount: number;
    interestRate: number;
    issuedDate: string;
    dueDate: string;
    status: string;
    type: string;
    latePaymentCount: number;
  }

  const [creditForm, setCreditForm] = useState<CreditEntry>({
    personId,
    amount: 0,
    interestRate: 0,
    issuedDate: new Date(),
    dueDate: new Date(),
    status: "ACTIVE",
    type: "SHORT_TERM",
    latePaymentCount: 0,
  });
  const [creditList, setCreditList] = useState<CreditListEntry[]>([]);

  useEffect(() => {
    setCreditForm((prev) => ({ ...prev, personId }));
    fetch(`/api/physical/get/${personId}/credits`)
      .then((res) => res.ok && res.json())
      .then(setCreditList)
      .catch(() => console.error("Nepavyko gauti kreditų"));
  }, [personId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value, type } = e.target;
    let finalValue: any = value;
    if (type === "number") finalValue = Number(value);
    else if (type === "date") finalValue = new Date(value);
    setCreditForm((prev) => ({ ...prev, [id]: finalValue }));
  };

  const saveCredit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/physical/import/credit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...creditForm,
        issuedDate: creditForm.issuedDate.toISOString().split("T")[0],
        dueDate: creditForm.dueDate.toISOString().split("T")[0],
      }),
    });
    res.ok
      ? (alert("Įrašyta"),
        fetch(`/api/physical/get/${personId}/credits`)
          .then((r) => r.ok && r.json())
          .then(setCreditList))
      : alert("Nepavyko išsaugoti");
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>Paskolos</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Suma</th>
              <th>Palūkanos</th>
              <th>Išdavimo data</th>
              <th>Pabaiga</th>
              <th>Statusas</th>
              <th>Tipas</th>
              <th>Vėlavimai</th>
            </tr>
          </thead>
          <tbody>
            {creditList.length > 0 ? (
              creditList.map((c) => (
                <tr key={c.id}>
                  <td>{c.amount}€</td>
                  <td>{c.interestRate}%</td>
                  <td>{c.issuedDate.split("T")[0]}</td>
                  <td>{c.dueDate.split("T")[0]}</td>
                  <td>
                    {c.status === "ACTIVE"
                      ? "Aktyvi"
                      : c.status === "PAID"
                        ? "Baigta"
                        : "Nevykdyta"}
                  </td>
                  <td>
                    {c.type === "SHORT_TERM" ? "Trumpalaikė" : "Ilgalaikė"}
                  </td>
                  <td>{c.latePaymentCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  Nėra įrašų
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={saveCredit} className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="amount">
            Suma (€)
          </label>
          <input
            className={styles.inputField}
            id="amount"
            type="number"
            value={creditForm.amount || ""}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="interestRate">
            Palūkanos (%)
          </label>
          <input
            className={styles.inputField}
            id="interestRate"
            type="number"
            value={creditForm.interestRate || ""}
            onChange={handleChange}
            min="0"
            step="0.1"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="latePaymentCount">
            Vėlavimų sk.
          </label>
          <input
            className={styles.inputField}
            id="latePaymentCount"
            type="number"
            value={creditForm.latePaymentCount || ""}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="issuedDate">
            Išdavimo data
          </label>
          <input
            className={styles.inputField}
            id="issuedDate"
            type="date"
            value={creditForm.issuedDate.toISOString().split("T")[0]}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="dueDate">
            Pabaigos data
          </label>
          <input
            className={styles.inputField}
            id="dueDate"
            type="date"
            value={creditForm.dueDate.toISOString().split("T")[0]}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="status">
            Statusas
          </label>
          <select
            className={styles.inputField}
            id="status"
            value={creditForm.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">Aktyvi</option>
            <option value="PAID">Baigta</option>
            <option value="DEFAULTED">Nevykdyta</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="type">
            Tipas
          </label>
          <select
            className={styles.inputField}
            id="type"
            value={creditForm.type}
            onChange={handleChange}
          >
            <option value="SHORT_TERM">Trumpalaikė</option>
            <option value="LONG_TERM">Ilgalaikė</option>
          </select>
        </div>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <button type="submit" className={styles.calculateButton}>
            Pridėti įrašą
          </button>
        </div>
      </form>
    </>
  );
}

function Documents({ personId }: { personId: number }) {
  interface Doc {
    id: number;
    filename: string;
    originalName: string;
  }
  const [documents, setDocuments] = useState<Doc[]>([]);

  const fetchDocuments = async () => {
    const res = await fetch(`/api/physical/get/${personId}/documents`);
    if (res.ok) setDocuments(await res.json());
  };

  useEffect(() => {
    fetchDocuments();
  }, [personId]);

  const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append("personId", personId.toString());
    formData.append("file", file);
    const res = await fetch("/api/physical/upload/document", {
      method: "POST",
      body: formData,
    });
    if (res.ok) fetchDocuments();
  };
  const readPdf = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/physical/read/data/${personId}`);
    res.ok
      ? alert("Dokumentas nuskaitytas")
      : alert("Nepavyko nuskaityti dokumento");
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
              download
            >
              Atsiųsti
            </a>
          </div>
        ))}
        {documents.length === 0 && (
          <p className={styles.emptyRow}>Nėra įkeltų dokumentų</p>
        )}
      </div>
      <button className={styles.calculateButton} style={{ marginTop: "1rem" }}>
        <label style={{ cursor: "inherit" }}>
          Įkelti naują failą
          <input type="file" hidden onChange={handleFileChange} />
        </label>
      </button>
      <form onSubmit={readPdf} style={{ marginTop: "1rem" }}>
        <button type="submit" className={styles.secondaryButton}>
          Nuskaityti duomenis iš dokumento
        </button>
      </form>
    </>
  );
}

export default PhysicalProfiles;
