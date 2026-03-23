import { useEffect, useState } from "react";
import styles from "./UsersPage.module.css";

function UsersPage() {
  interface User {
    id: bigint;
    email: string;
    password: string;
    telephone: string;
    fullname: string;
    personId: string;
    role: string;
  }

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_LINK}/users/get`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <>
      <h1 className={styles.title}>Vartotojų sąrašas</h1>

      <div className={styles.user_div}>
        <input type="text" placeholder="Paieška..."></input>
        <a>Sukurti vartotoją</a>
      </div>

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
                {users.length > 0 && users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.telephone}</td>
                        <td>{user.fullname}</td>
                        <td>{user.personId}</td>
                        <td>{user.role}</td>
                    </tr>
                )
                )
                }

          {users.length == 0 && (
            <tr key={0}>
              <td>Tuščia</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default UsersPage;
