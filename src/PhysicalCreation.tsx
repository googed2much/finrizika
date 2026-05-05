import { useState } from "react";
import styles from "./PhysicalCreation.module.css";

interface Props {
  onSuccess?: () => void;
}

function PhysicalCreation({ onSuccess }: Props) {
  interface PersonProfile {
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

  const [personProfile, setPersonProfile] = useState<PersonProfile>({
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setPersonProfile((prev) => ({
      ...prev,
      [name]:
        type === "date"
          ? new Date(value)
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonProfile((prev) => ({ ...prev, [name]: value }));
  };

  async function saveProfile() {
    if (
      !personProfile.citizenId ||
      !personProfile.fullname ||
      !personProfile.email
    ) {
      alert(
        "Prašome užpildyti privalomus laukus: asmens kodą, vardą pavardę ir el. paštą",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/physical/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personProfile),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Nepavyko išsaugoti asmens");
      }

      const data = await response.json();
      console.log("SAVED ID:", data.id);

      setPersonProfile({
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

      onSuccess?.();
    } catch (err) {
      console.error("Klaida saugant profilį:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Įvyko netikėta klaida. Bandykite dar kartą.",
      );
      alert(
        "Nepavyko išsaugoti: " +
          (err instanceof Error ? err.message : "Klaida"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const FIELDS: {
    name: keyof PersonProfile;
    label: string;
    type: string;
    options?: { value: string; label2: string }[];
    required?: boolean;
  }[] = [
    {
      name: "citizenId",
      label: "Asmens kodas *",
      type: "text",
      required: true,
    },
    {
      name: "fullname",
      label: "Vardas pavardė *",
      type: "text",
      required: true,
    },
    { name: "telephone", label: "Telefono numeris", type: "tel" },
    {
      name: "email",
      label: "Elektroninis paštas *",
      type: "email",
      required: true,
    },
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

  const getDisplayValue = (name: keyof PersonProfile, type: string) => {
    const val = personProfile[name];
    if (type === "date" && val instanceof Date)
      return val.toISOString().split("T")[0];
    return String(val ?? "");
  };

  return (
    <>
      <div className={styles.creationBackground}>
        <div className={styles.creationDiv}>
          <div className={styles.creationBox}>
            <h1>Fizinio asmens profilio kūrimas</h1>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.creationDiv2}>
              {FIELDS.map(({ name, label, type, options, required }) => (
                <div key={name}>
                  <label htmlFor={name}>
                    {label}
                    {required && <span className={styles.required}> *</span>}
                  </label>
                  {type === "select" ? (
                    <select
                      id={name}
                      name={name}
                      value={getDisplayValue(name, type)}
                      onChange={handleSelectChange}
                      disabled={isSubmitting}
                    >
                      {options!.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label2}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={name}
                      name={name}
                      type={type}
                      value={getDisplayValue(name, type)}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder={required ? "Privalomas laukas" : ""}
                    />
                  )}
                </div>
              ))}

              <button
                onClick={saveProfile}
                disabled={isSubmitting}
                className={isSubmitting ? styles.submitting : ""}
              >
                {isSubmitting ? "Saugoma..." : "Išsaugoti"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PhysicalCreation;
