import { Link, Route, Routes, useLocation, Navigate } from "react-router-dom";
import styles from "./Home.module.css";
import ProfilePage from "./ProfilePage";
import UsersPage from "./UsersPage";
import CreditRatingCalculator from "./CreditRating";
import Portfolio from "./Portfolio";
import CompanyProfiles from "./CompanyProfiles";
import PhysicalCreation from "./PhysicalCreation";
import PhysicalProfiles from "./PhysicalProfiles";
import CompanyCreation from "./CompanyCreation";

function Home() {
  const location = useLocation();

  // Helper to check if a route matches the current URL
  const isActive = (path) => location.pathname === `/dashboard/${path}`;

  async function logout() {
    await fetch(`/api/users/logout`);
    window.location.href = "/login";
  }

  return (
    <>
      <div className={styles.dashboard_grid}>
        <div className={styles.dashboard_sidebar_div}>
          <div className={styles.sidebar_seperator_div}> 
            <h1 className={styles.LogoText}>Finrizika</h1>

            <Link 
              to="/dashboard/portfolio" 
              className={`${styles.link} ${isActive('portfolio') ? styles.active : ''}`}
            >
              Portfelis 
            </Link>

            <Link 
              to="/dashboard/Credit-Rating-Calculator" 
              className={`${styles.link} ${isActive('Credit-Rating-Calculator') ? styles.active : ''}`}
            >
              Kredito Reitingo Skaičiuoklė
            </Link>

            <Link 
              to="/dashboard/users" 
              className={`${styles.link} ${isActive('users') ? styles.active : ''}`}
            >
              Vartotojai 
            </Link>
          </div> 

          <div className={styles.sidebar_seperator_div}> 
            <Link 
              to="/dashboard/profile" 
              className={`${styles.link} ${isActive('profile') ? styles.active : ''}`}
            >
              Profilis 
            </Link>

            <a 
              className={`${styles.link} ${styles.danger}`} 
              onClick={(e) => { e.preventDefault(); logout(); }}
            >
              Atsijungti
            </a>
          </div> 
        </div> 

        <div className={styles.dashboard_content_div}>
          <Routes>
            <Route path="" element={<Navigate to="portfolio" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="Credit-Rating-Calculator" element={<CreditRatingCalculator />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="create-juridical" element={<CompanyProfiles />} />
            <Route path="create-physical" element={<PhysicalCreation />} />
            <Route path="physical-profile" element={<PhysicalProfiles />} />
            <Route path="juridical-profile" element={<CompanyCreation />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Home;