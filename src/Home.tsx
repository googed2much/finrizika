import { Link, Route, Routes } from "react-router-dom";
import styles from "./Home.module.css";
import ProfilePage from "./ProfilePage";
import UsersPage from "./UsersPage";
import CreditRatingCalculator from "./CreditRating";
import Portfolio from "./Portfolio";

function Home() {
  async function logout() {
    await fetch(`/api/users/logout`);
    window.location.href = "/login";
  }

  return (
    <>
      <div className={styles.dashboard_grid}>
        <div className={styles.dashboard_selection_div}>
          <h1>Finrizika</h1>
          <Link to="/dashboard/portfolio" className={styles.link}>Portfelis &gt;&gt;</Link>
          <div className={styles.dropdown}>
            <span className={styles.link2}>Skaičiuoklės &gt;&gt;</span>
            <div className={styles.dropdown_content}>
              <Link to="/dashboard/Credit-Rating-Calculator">
                Kredito Reitingo Skaičiuoklė
              </Link>
              <Link to="/dashboard/calc2">Skaičiuoklė2</Link>
              <Link to="/dashboard/calc3">Skaičiuoklė3</Link>
            </div>
          </div>
          <Link to="/dashboard/profile" className={styles.link}>
            Profilis &gt;&gt;
          </Link>
          <Link to="/dashboard/users" className={styles.link}>
            Vartotojai &gt;&gt;
          </Link>
          <a className={styles.link} onClick={(_) => logout()}>
            Atsijungti
          </a>
        </div>

        <div className={styles.dashboard_content_div}>
          <Routes>
            <Route
              path=""
              element={<h1 className={styles.title}>Sveiki atvykę</h1>}
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route
              path="Credit-Rating-Calculator"
              element={<CreditRatingCalculator />}
            />
            <Route path="portfolio" element={<Portfolio />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Home;
