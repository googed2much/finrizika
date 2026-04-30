import { useState } from "react";
import styles from "./AccountCreation.module.css";

function AccountCreation({ close }: { close: () => void }) {
  interface NewUser {
    email: string;
    password: string;
    telephone: string;
    fullname: string;
    citizenId: string;
    role: string;
  }

  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    password: "",
    telephone: "",
    fullname: "",
    citizenId: "",
    role: "INVESTOR",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const FIELDS: {
    name: keyof NewUser;
    label: string;
    type: string;
    options?: { value: string; label2: string }[];
  }[] = [
    { name: "email", label: "Elektroninis paštas", type: "email" },
    { name: "password", label: "Slaptažodis", type: "password" },
    { name: "telephone", label: "Telefono numeris", type: "tel" },
    { name: "fullname", label: "Vardas pavardė", type: "text" },
    { name: "citizenId", label: "Asmens kodas", type: "text" },
    {
      name: "role",
      label: "Privilegijos",
      type: "select",
      options: [
        { value: "ADMINISTRATOR", label2: "Administratorius" },
        { value: "INVESTOR", label2: "Darbuotojas" },
      ],
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  async function saveNewUser() {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
        credentials: "include",
      });

      if (response.ok) {
        alert("Naudotojas sėkmingai sukurtas!");
        close();
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "Nepavyko išsaugoti naudotojo");
      }
    } catch {
      alert("Įvyko klaida ryšio metu");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.modal_container}>
      <h2 className={styles.title}>Naujo naudotojo sukūrimas</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        {FIELDS.map(({ name, label, type, options }) => (
          <div key={name} className={styles.form_group}>
            <label htmlFor={name}>{label}</label>
            {type === "select" ? (
              <select
                id={name}
                name={name}
                value={newUser[name]}
                onChange={handleChange}
                className={styles.input}
              >
                {options?.map((opt) => (
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
                value={newUser[name]}
                onChange={handleChange}
                className={styles.input}
                required
              />
            )}
          </div>
        ))}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={close}
            className={styles.button_secondary}
            disabled={isSubmitting}
          >
            Atšaukti
          </button>
          <button
            type="button"
            onClick={saveNewUser}
            className={styles.button_primary}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Įrašoma..." : "Išsaugoti"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountCreation;
