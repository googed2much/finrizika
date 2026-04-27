import { Link, Route, Routes,useLocation } from "react-router-dom";
import styles from "./Home.module.css";
import ProfilePage from "./ProfilePage";
import UsersPage from "./UsersPage";
import CreditRatingCalculator from "./CreditRating";
import Portfolio from "./Portfolio";
import CompanyProfiles from "./CompanyProfiles";
import PhysicalCreation from "./PhysicalCreation";
import PhysicalProfiles from "./PhysicalProfiles";
import CompanyCreation from "./CompanyCreation";
import InterestCalculator from "./InterestCalculator";

function Home() {
  
  const location = useLocation();
  async function logout() {
    await fetch(`/api/users/logout`);
    window.location.href = "/login";
  }

  return (
    <>
      <div className={styles.dashboard_grid}>
        <div className={`${styles.dashboard_selection_div} ${location.pathname === "/dashboard/physical-profile" ? styles.physicalNavOverride : location.pathname==="/dashboard/juridical-profile" ? styles.physicalNavOverride : location.pathname==="/dashboard/portfolio" ? styles.physicalNavOverride : "" }`}>
          <h1>Finrizika</h1>
          <Link to="/dashboard/portfolio" className={styles.link}>Portfelis &gt;&gt;</Link>
          <div className={styles.dropdown}>
            <span className={styles.link2}>Skaičiuoklės &gt;&gt;</span>
            <div className={styles.dropdown_content}>
              <Link to="/dashboard/Credit-Rating-Calculator">
                Paskolos Skaičiuoklė
              </Link>
              <Link to="/dashboard/interest-calculator">Palūkanų Skaičiuoklė</Link>
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

        <div className={`${styles.dashboard_content_div} ${location.pathname === "/dashboard/physical-profile" ? styles.physicalNavOverrideContent : location.pathname === "/dashboard/juridical-profile" ? styles.physicalNavOverrideContent : location.pathname==="/dashboard/portfolio" ? styles.physicalNavOverrideContent : "" }`}>
          <Routes>
            <Route
              path=""
              element={<h1 className={styles.title}>Sveiki atvykę</h1>}
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="create-juridical" element={<CompanyProfiles />} />
            <Route path="create-physical" element={<PhysicalCreation />} />
            <Route path="Credit-Rating-Calculator" element={<CreditRatingCalculator />} />
            
            <Route path="interest-calculator" element={<InterestCalculator />} />
            <Route path="physical-profile" element={<PhysicalProfiles />} />
            <Route path="juridical-profile" element={<CompanyCreation />} />
            
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Home;
