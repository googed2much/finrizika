import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CompanyProfiles.module.css";
// import { NumericInput } from "./Components/NumericInput";

function JuridicalProfiles() {
  const navigate = useNavigate();

  const [companyId, setCompanyId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [ownerFullname,setOwnerFullname] = useState<string>("");
  // Code start

  function allFieldsFilled() {
    const required = [
      companyId,
      name,
      email,
      phoneNumber,
      ownerFullname
    ];

    return required.every(
      (value) => value !== "" && value !== null && value !== undefined,
    );
  }

  async function submitData() {
    if (!allFieldsFilled()) {
      alert("Prašome užpildyti visus laukus");
      return;
    }

    const payload = {
      companyId: companyId,
      name: name,
      telephone: phoneNumber,
      email: email,
      ownerFullname : ownerFullname
    };

    const response = await fetch(
      `/api/juridical/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include"
      },
    );

    if (!response.ok) {
      console.error("Failed to send data");
      return;
    }
    const data = await response.json();
    navigate("/dashboard/juridical-profile", { state: { id: data } });
    console.log("Data sent successfully");
  }



  return (
    <>
      <div className={styles.creationBackground}>
        <div className={styles.creationDiv}>
          <div className={styles.creationBox}>
            <h1>Juridinių asmenų kūrimas</h1>
            <div className={styles.creationDiv2}>
              <div>
                <label>Įmonės kodas</label>
                <input
                  type="text"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                />
              </div>

              <div>
                <label>Įmonės pavadinimas</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label>El.paštas</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label>Įmonės atstovo telefono numeris</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label>Įmonės atstovo pilnas vardas</label>
                <input
                  type="text"
                  value={ownerFullname}
                  onChange={(e) => setOwnerFullname(e.target.value)}
                />
              </div>

              <button onClick={submitData}>Išsaugoti</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default JuridicalProfiles;
