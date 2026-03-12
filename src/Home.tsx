import { Link, Route, Routes } from "react-router-dom"
import styles from "./Home.module.css"
import JuridicalProfiles from "./JuridicalProfiles"
import PhysicalProfiles from "./PhysicalProfiles"
import ProfilePage from "./ProfilePage"

function Home() {
    return (
    <>
        <div className={styles.dashboard_grid}>
            <div className={styles.dashboard_selection_div}>
                <h1>Finrizika</h1>
                <Link to="/dashboard/juridical" className={styles.link}>Juridiniai asmenys &gt;&gt;</Link>
                <Link to="/dashboard/physical" className={styles.link}>Fiziniai asmenys &gt;&gt;</Link>
                <Link to="/dashboard/profile" className={styles.link}>Profilis &gt;&gt;</Link>
            </div>

            <div className={styles.dashboard_content_div}>
                <Routes>
                    <Route path="" element={<h1 className={styles.title}>Sveiki atvykę</h1>} />
                    <Route path="juridical" element={<JuridicalProfiles />} />
                    <Route path="physical" element={<PhysicalProfiles />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Routes>
            </div>
        </div>
    </>
    )
}

export default Home
