import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import g_styles from "./Components/general_style.module.css";

function ProfilePage() {
  interface CurrentUser {
    id: string;
    email: string;
    telephone: string;
    password: string | undefined;
    fullname: string;
    personId: string;
  }

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/users/getme`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => setCurrentUser(data))
      .catch((err) => {
        console.error("Fetch failed:", err);
        setCurrentUser({
          id: "",
          email: "",
          telephone: "",
          password: "",
          fullname: "",
          personId: "",
        });
        setMessage({
          type: "error",
          text: "Serveris nepasiekiamas. Rodomi tušti laukai.",
        });
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCurrentUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const { password, ...rest } = currentUser;
      const payload = password ? { ...rest, password } : rest;

      const response = await fetch(`/api/users/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Duomenys sėkmingai atnaujinti!" });
        setCurrentUser((prev) => (prev ? { ...prev, password: "" } : prev));
      } else {
        setMessage({ type: "error", text: "Nepavyko atnaujinti duomenų." });
      }
    } catch {
      setMessage({ type: "error", text: "Įvyko klaida ryšio metu." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (currentUser === null)
    return <div className={styles.loading}>Kraunami duomenys...</div>;

  return (
    <div className={g_styles.page_wrapper}>
      <form className={styles.profile_card} onSubmit={handleSubmit}>
        <h1 className={g_styles.card_title}>Profilis</h1>

        {message && (
          <div
            className={`${styles.message} ${styles[`message_${message.type}`]}`}
          >
            {message.text}
          </div>
        )}

        <div className={styles.form_group}>
          <label htmlFor="id">ID</label>
          <input
            id="id"
            name="id"
            type="text"
            value={currentUser.id}
            disabled
            className={styles.input}
          />
        </div>

        <div className={styles.form_group}>
          <label htmlFor="email">Elektroninis paštas</label>
          <input
            id="email"
            name="email"
            type="email"
            value={currentUser.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label htmlFor="password">Naujas slaptažodis</label>
          <input
            id="password"
            name="password"
            type="password"
            value={currentUser.password || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Palikite tuščią, jei nekeičiate"
          />
        </div>

        <div className={styles.form_group}>
          <label htmlFor="telephone">Telefono numeris</label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            value={currentUser.telephone}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label htmlFor="fullname">Pilnas vardas</label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            value={currentUser.fullname}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label htmlFor="personId">Asmens kodas</label>
          <input
            id="personId"
            name="personId"
            type="text"
            value={currentUser.personId}
            onChange={handleChange}
            className={styles.input}
            disabled
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
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

export default ProfilePage;
