import { Link, Route, Routes, useLocation, Navigate } from "react-router-dom";
import styles from "./Home.module.css";
import ProfilePage from "./ProfilePage";
import UsersPage from "./UsersPage";
import Portfolio from "./Portfolio";
import CompanyProfiles from "./CompanyProfiles";
import PhysicalCreation from "./PhysicalCreation";
import PhysicalProfiles from "./PhysicalProfiles";
import CompanyCreation from "./CompanyCreation";
import InterestCalculator from "./InterestCalculator";
import CreditRatingCalculator from "./CreditRating";

function Home() {
  const location = useLocation();

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
            <div>
              <h1 className={styles.LogoText}>Finrizika</h1>

              <Link
                to="/dashboard/portfolio"
                className={`${styles.link} ${isActive("portfolio") ? styles.active : ""}`}
              >
                Portfelis
              </Link>

              <Link
                to="/dashboard/users"
                className={`${styles.link} ${isActive("users") ? styles.active : ""}`}
              >
                Vartotojai
              </Link>
            </div>

            <div className={styles.sidebar_divider} />

            <div className={styles.sidebar_seperator_div}>
              <h2 className={styles.sidebar_section_title}>Skaiciuoklės</h2>

              <Link
                to="/dashboard/credit-rating-calculator"
                className={`${styles.link} ${isActive("credit-rating-calculator") ? styles.active : ""}`}
              >
                Credito reitingas
              </Link>

              <Link
                to="/dashboard/interest-calculator"
                className={`${styles.link} ${isActive("interest-calculator") ? styles.active : ""}`}
              >
                Paskola
              </Link>
            </div>
          </div>

          <div className={styles.sidebar_seperator_div}>
            <div className={styles.sidebar_divider} />
            <Link
              to="/dashboard/profile"
              className={`${styles.link} ${isActive("profile") ? styles.active : ""}`}
            >
              Redaguoti profilį
            </Link>

            <a
              className={`${styles.link} ${styles.danger}`}
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
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
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="create-juridical" element={<CompanyCreation />} />
            <Route path="create-physical" element={<PhysicalCreation />} />
            <Route
              path="interest-calculator"
              element={<InterestCalculator />}
            />
            <Route
              path="credit-rating-calculator"
              element={<CreditRatingCalculator />}
            />
            <Route path="physical-profile" element={<PhysicalProfiles />} />
            <Route path="juridical-profile" element={<CompanyProfiles />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Home;
