import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CompanyProfiles.module.css";
import { NumericInput } from "./Components/NumericInput";

function JuridicalProfiles() {
  interface Company {
    id: string;
    name: string;
    telephone: string;
  }

  const [companyID, setCompanyID] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [score, setScore] = useState<number>();

  // Sending out constants

  const [shortTermAssets, setShortTermAssets] = useState<number | "">("");
  const [inventory, setInventory] = useState<number | "">("");
  const [shortTermLiabilities, setShortTermLiabilities] = useState<number | "">(
    "",
  );
  const [equity, setEquity] = useState<number | "">("");
  const [totalAssets, setTotalAssets] = useState<number | "">("");
  const [netProfit, setNetProfit] = useState<number | "">("");
  const [interest, setInterest] = useState<number | "">("");
  const [taxes, setTaxes] = useState<number | "">("");
  const [interestExpenses, setInterestExpenses] = useState<number | "">("");
  const [depreciation, setDepreciation] = useState<number | "">("");
  const [amortization, setAmortization] = useState<number | "">("");
  const [financialLiabilities, setFinancialLiabilities] = useState<number | "">(
    "",
  );
  const [cash, setCash] = useState<number | "">("");
  const [salesRevenue, setSalesRevenue] = useState<number | "">("");
  const [changeInSalesRevenue, setChangeInSalesRevenue] = useState<number | "">(
    "",
  );
  const [companyCode, setCompanyCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // Code start

  function allFieldsFilled() {
    const required = [
      companyCode,
      name,
      phoneNumber,
      shortTermAssets,
      inventory,
      shortTermLiabilities,
      equity,
      totalAssets,
      netProfit,
      interest,
      taxes,
      interestExpenses,
      depreciation,
      amortization,
      financialLiabilities,
      cash,
      salesRevenue,
      changeInSalesRevenue,
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
      shortTermAssets: shortTermAssets === "" ? null : shortTermAssets,
      inventory: inventory === "" ? null : inventory,
      shortTermLiabilities:
        shortTermLiabilities === "" ? null : shortTermLiabilities,
      totalAssets: totalAssets === "" ? null : totalAssets,
      equity: equity === "" ? null : equity,
      netProfit: netProfit === "" ? null : netProfit,
      interest: interest === "" ? null : interest,
      taxes: taxes === "" ? null : taxes,
      interestExpenses: interestExpenses === "" ? null : interestExpenses,
      depreciation: depreciation === "" ? null : depreciation,
      amortization: amortization === "" ? null : amortization,
      financialLiabilities:
        financialLiabilities === "" ? null : financialLiabilities,
      cash: cash === "" ? null : cash,
      salesRevenue: salesRevenue === "" ? null : salesRevenue,
      changeInSalesRevenue:
        changeInSalesRevenue === "" ? null : changeInSalesRevenue,
      companyCode,
      name,
      phoneNumber,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_LINK}/company/data/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      console.error("Failed to send data");
      return;
    }

    setScore(await response.json());
    console.log("Data sent successfully");
  }

  async function searchProfile() {
    const data = [
      { id: companyID, name: "test name", telephone: "test telephone" },
    ];
    setCompanies(data);
    return;
  }

  return (
    <>
      <h1>Jurininių asmenų rizikos įvertinimas</h1>

      <div>
        <div>
          <label>Įmonės kodas</label>
          <input
            type="text"
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
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
          <label>Įmonės atstovo telefono numeris</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div>
          <label>Trumpalaikis turtas</label>
          <NumericInput value={shortTermAssets} onChange={setShortTermAssets} />
        </div>

        <div>
          <label>Atsargos</label>
          <NumericInput value={inventory} onChange={setInventory} />
        </div>

        <div>
          <label>Trumpalaikiai įsipareigojimai</label>
          <NumericInput
            value={shortTermLiabilities}
            onChange={setShortTermLiabilities}
          />
        </div>

        <div>
          <label>Nuosavas kapitalas</label>
          <NumericInput value={equity} onChange={setEquity} />
        </div>

        <div>
          <label> Visas turtas </label>
          <NumericInput value={totalAssets} onChange={setTotalAssets} />
        </div>

        <div>
          <label> Grynas pelnas</label>
          <NumericInput value={netProfit} onChange={setNetProfit} />
        </div>

        <div>
          <label>Palūkanos</label>
          <NumericInput value={interest} onChange={setInterest} />
        </div>

        <div>
          <label>Sumokėti mokesčiai</label>
          <NumericInput value={taxes} onChange={setTaxes} />
        </div>

        <div>
          <label>Palūkanų sąnaudos</label>
          <NumericInput
            value={interestExpenses}
            onChange={setInterestExpenses}
          />
        </div>

        <div>
          <label>Nusidėvėjimas</label>
          <NumericInput value={depreciation} onChange={setDepreciation} />
        </div>

        <div>
          <label>Amortizacija</label>
          <NumericInput value={amortization} onChange={setAmortization} />
        </div>

        <div>
          <label>Finansiniai įsipareigojimai</label>
          <NumericInput
            value={financialLiabilities}
            onChange={setFinancialLiabilities}
          />
        </div>

        <div>
          <label>Grynieji pinigai</label>
          <NumericInput value={cash} onChange={setCash} />
        </div>

        <div>
          <label>Pardavimų pajamos</label>
          <NumericInput value={salesRevenue} onChange={setSalesRevenue} />
        </div>

        <div>
          <label>Pardavimų pajamų pokytis (%)</label>
          <NumericInput
            value={changeInSalesRevenue}
            onChange={setChangeInSalesRevenue}
          />
        </div>
      </div>

      <button onClick={submitData}>Pateikti</button>

      <div>Rizikos balas: {score}</div>

      <h1 className={styles.title}>Juridinių asmenų paieška</h1>

      <div className={styles.button_div}>
        <input
          type="number"
          min={1}
          step={1}
          placeholder="Identifikacijos kodas"
          value={companyID}
          onChange={(e) => setCompanyID(e.target.value)}
        ></input>
        <a className={styles.link} onClick={searchProfile}>
          Paieška
        </a>
        <Link to="/create-juridical" className={styles.link}>
          Sukurti naują profilį
        </Link>
      </div>

      <table className={styles.company_table}>
        <thead>
          <tr className={styles.company_table_thead}>
            <th>Kodas</th>
            <th>Pavadinimas</th>
            <th>Telefono numeris</th>
          </tr>
        </thead>

        {companies.length > 0 && (
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.telephone}</td>
              </tr>
            ))}
          </tbody>
        )}

        {companies.length === 0 && (
          <tbody>
            <tr key={0}>
              <td>Tuščia</td>
            </tr>
          </tbody>
        )}
      </table>
    </>
  );
}

export default JuridicalProfiles;
