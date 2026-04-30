import { useEffect, useState } from "react";
import AccountCreation from "./AccountCreation.tsx";
import Popup from "reactjs-popup";
import styles from "./UsersPage.module.css";
import g_styles from "./Components/general_style.module.css";

const DEV_MODE = false;

const ROLE_TRANSLATIONS: Record<string, string> = {
  ADMINISTRATOR: "Administratorius",
  INVESTOR: "Darbuotojas",
};

const getRoleDisplay = (role: string) => {
  const label = ROLE_TRANSLATIONS[role] || role;
  const classSuffix = role.toLowerCase();
  return { label, classSuffix };
};

const MOCK_USERS: {
  id: bigint;
  email: string;
  telephone: string;
  fullname: string;
  citizenId: string;
  role: string;
}[] = [
  {
    id: BigInt(1),
    email: "admin@finrizika.lt",
    telephone: "+370 600 00001",
    fullname: "Jonas Jonaitis",
    citizenId: "30101010101",
    role: "ADMINISTRATOR",
  },
  {
    id: BigInt(2),
    email: "petras.investor@gmail.com",
    telephone: "+370 611 22334",
    fullname: "Petras Petraitis",
    citizenId: "39901010101",
    role: "INVESTOR",
  },
  {
    id: BigInt(3),
    email: "irena.manager@finrizika.lt",
    telephone: "+370 622 33445",
    fullname: "Irena Irenaitė",
    citizenId: "49902020202",
    role: "ADMINISTRATOR",
  },
  {
    id: BigInt(4),
    email: "tomas.dev@finrizika.lt",
    telephone: "+370 633 44556",
    fullname: "Tomas Tomaitis",
    citizenId: "39903030303",
    role: "INVESTOR",
  },
  {
    id: BigInt(5),
    email: "laura.support@finrizika.lt",
    telephone: "+370 644 55667",
    fullname: "Laura Laurynaitė",
    citizenId: "49904040404",
    role: "ADMINISTRATOR",
  },
];

function UsersPage() {
  interface User {
    id: bigint;
    email: string;
    telephone: string;
    fullname: string;
    citizenId: string;
    role: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (DEV_MODE) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          setUsers(MOCK_USERS);
        } else {
          const res = await fetch(`/api/users/get/list`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Server error");
          const data = await res.json();
          setUsers(data);
        }
      } catch {
        setError("Serveris nepasiekiamas. Nepavyko gauti naudotojų sąrašo.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.citizenId.includes(searchTerm),
  );

  return (
    <div className={g_styles.page_wrapper}>
      <div className={g_styles.card}>
        <h1 className={g_styles.card_title}>Vartotojų sąrašas</h1>
        {isLoading && (
          <div className={styles.status_message}>Kraunami duomenys...</div>
        )}
        {error && <div className={styles.status_error}>{error}</div>}
        {!isLoading && !error && (
          <>
            <div className={styles.controls_div}>
              <input
                type="text"
                placeholder="Paieška..."
                className={styles.search_input}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Popup
                trigger={
                  <button className={styles.button_primary}>
                    + Sukurti vartotoją
                  </button>
                }
                modal
                nested
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              >
                {(close: any) => <AccountCreation close={close} />}
              </Popup>
            </div>

            <div className={styles.table_container}>
              <table className={styles.user_table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Elektroninis paštas</th>
                    <th>Telefono numeris</th>
                    <th>Pilnas vardas</th>
                    <th>Asmens kodas</th>
                    <th>Privilegijos</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const { label, classSuffix } = getRoleDisplay(user.role);
                      return (
                        <tr key={user.id.toString()}>
                          <td>{user.id.toString()}</td>
                          <td>{user.email}</td>
                          <td>{user.telephone}</td>
                          <td>{user.fullname}</td>
                          <td>{user.citizenId}</td>
                          <td>
                            <span
                              className={`${styles.badge} ${styles[`badge_${classSuffix}`]}`}
                            >
                              {label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className={styles.empty_state}>
                        {searchTerm ? "Nerasta rezultatų" : "Tuščia"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
