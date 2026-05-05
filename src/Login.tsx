import { useState } from "react";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const response = await fetch(`/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Neteisingas el. paštas arba slaptažodis");
    }
  }

  return (
    <div className={styles.login_div}>
      <div className={styles.box_div}>
        <h1 className={styles.title}>Finrizika</h1>
        <p className={styles.subtitle}>Prisijunkite prie savo paskyros</p>

        <div className={styles.form_group}>
          <label htmlFor="email">Elektroninis paštas</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label htmlFor="password">Slaptažodis</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button onClick={login} className={styles.button}>
          Prisijungti
        </button>
      </div>
    </div>
  );
}

export default Login;
