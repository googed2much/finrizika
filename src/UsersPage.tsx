import { useEffect, useState } from "react";
import AccountCreation from "./AccountCreation.tsx"
import Popup from 'reactjs-popup';
import styles from "./UsersPage.module.css";

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

  useEffect(() => {
    fetch(`/api/users/get/list`, {
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
        <Popup trigger={<button>Sukurti vartotoja</button>} modal nested>
          {((close: any) => <AccountCreation close={close} />) as any}
        </Popup>
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
                  <td>{user.citizenId}</td>
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
