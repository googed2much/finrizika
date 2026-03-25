import { useState } from "react";
import styles from "./CompanyProfiles.module.css";
import { NumericInput } from "./Components/NumericInput";

function JuridicalProfiles() {
  // interface Company {
  //   id: string;
  //   companyCode: string;
  //   name: string;
  //   phoneNumber: string;
  //   score: number;
  // }

  // const [searchCompanyCode, setSearchCompanyCode] = useState<string>("");
  // const [companies, setCompanies] = useState<Company[]>([]);
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
  const [email, setEmail] = useState<string>("");

  // Code start

  function allFieldsFilled() {
    const required = [
      companyCode,
      name,
      email,
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
    
    // const payload = {
    //   shortTermAssets: shortTermAssets === "" ? null : shortTermAssets,
    //   inventory: inventory === "" ? null : inventory,
    //   shortTermLiabilities:
    //     shortTermLiabilities === "" ? null : shortTermLiabilities,
    //   totalAssets: totalAssets === "" ? null : totalAssets,
    //   equity: equity === "" ? null : equity,
    //   netProfit: netProfit === "" ? null : netProfit,
    //   interest: interest === "" ? null : interest,
    //   taxes: taxes === "" ? null : taxes,
    //   interestExpenses: interestExpenses === "" ? null : interestExpenses,
    //   depreciation: depreciation === "" ? null : depreciation,
    //   amortization: amortization === "" ? null : amortization,
    //   financialLiabilities:
    //     financialLiabilities === "" ? null : financialLiabilities,
    //   cash: cash === "" ? null : cash,
    //   salesRevenue: salesRevenue === "" ? null : salesRevenue,
    //   changeInSalesRevenue:
    //     changeInSalesRevenue === "" ? null : changeInSalesRevenue,
    //   companyCode,
    //   name,
    //   phoneNumber,
    // };
    const payload = {
      code: Number(companyCode),
      owner: name,
      telephone: phoneNumber,
      email: email
    };

    const response = await fetch(
      `/api/company/create`,
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

    setScore(await response.json());
    console.log("Data sent successfully");
  }

  

  return (
    <>
    <div className={styles.creationBackground}>
    <a href="/dashboard">Grįžti atgal</a>
      <div className={styles.creationDiv}>
    
      <h1>Jurininių asmenų rizikos įvertinimas</h1>

      <div className="">
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

      <div>Rizikos įvertinimas: {score}</div>

      </div>
      </div>
    </>
  );
}

export default JuridicalProfiles;
