import { useState } from "react";
import type { CompanyInfo } from "./types/CompanyInfo";
import { sendCompanyData } from "./api/SendCompanyData";

function CompanyEvaluation() {
  const [company, setCompany] = useState<CompanyInfo>({
    quickLiquidityRatio: 0,
    equityRatio: 0,
    interestCoverage: 0,
    netDebtRatio: 0,
    netProfitability: 0,
    changeInSalesRevenue: 0,
  });

  //   async function calculateRisk() {
  //     let points: number = 0;

  //     if (quickLiquidityRatio < 0.8) {
  //       // do nothing
  //     } else if (quickLiquidityRatio < 1) {
  //       points += 50;
  //     } else if (quickLiquidityRatio < 1.2) {
  //       points += 100;
  //     } else if (quickLiquidityRatio < 1.5) {
  //       points += 140;
  //     } else {
  //       points += 166.67;
  //     }

  //     if (equityRatio < 0.2) {
  //       // do nothing
  //     } else if (equityRatio < 0.3) {
  //       points += 50;
  //     } else if (equityRatio < 0.4) {
  //       points += 100;
  //     } else if (equityRatio < 0.5) {
  //       points += 140;
  //     } else {
  //       points += 166.67;
  //     }

  //     if (interestCoverage < 1) {
  //       // do nothing
  //     } else if (interestCoverage < 2) {
  //       points += 50;
  //     } else if (interestCoverage < 3) {
  //       points += 100;
  //     } else if (interestCoverage < 5) {
  //       points += 140;
  //     } else {
  //       points += 166.67;
  //     }

  //     if (netDebtRatio > 5) {
  //       // do nothing
  //     } else if (netDebtRatio > 4) {
  //       points += 50;
  //     } else if (netDebtRatio > 3) {
  //       points += 100;
  //     } else if (netDebtRatio > 2) {
  //       points += 140;
  //     } else {
  //       points += 166.67;
  //     }

  //     if (netProfitability < 0) {
  //       // do nothing
  //     } else if (netProfitability < 5) {
  //       points += 50;
  //     } else if (netProfitability < 10) {
  //       points += 100;
  //     } else if (netProfitability < 15) {
  //       points += 140;
  //     } else {
  //       points += 166.67;
  //     }

  //     if (changeInSalesRevenue < -10) {
  //       // do nothing
  //     } else if (changeInSalesRevenue < 0) {
  //       points += 50;
  //     } else if (changeInSalesRevenue < 5) {
  //       points += 100;
  //     } else if (changeInSalesRevenue < 15) {
  //       points += 140;
  //     } else {
  //       points += 166.67;
  //     }

  //     if (points > 1000) {
  //       points = 1000;
  //     }

  //     const score = Math.min(10, Math.floor((1000 - points) / 100) + 1);
  //     setScore(score);
  //     console.log(points);
  //     console.log(score);
  //   }

  function handleCompanyInfoChange<K extends keyof CompanyInfo>(
    key: K,
    value: string,
  ) {
    if (/^\d*\.?\d*$/.test(value)) {
      setCompany((prev) => ({
        ...prev,
        [key]: Number(value),
      }));
    }
  }

  async function handleSubmit() {
    try {
      const result = await sendCompanyData(company);
      console.log("Server response:", result);
    } catch (err) {
      console.error("Error sending data:", err);
    }
  }

  return (
    <>
      <h1>Jurininių asmenų rizikos įvertinimas</h1>

      <div>
        <label>Greitasis likvidumo koeficientas</label>
        <input
          type="text"
          value={company.quickLiquidityRatio}
          onChange={(e) =>
            handleCompanyInfoChange("quickLiquidityRatio", e.target.value)
          }
        />
      </div>

      <div>
        <label>Nuosavybės koeficientas</label>
        <input
          type="text"
          value={company.equityRatio}
          onChange={(e) =>
            handleCompanyInfoChange("equityRatio", e.target.value)
          }
        />
      </div>

      <div>
        <label>Palūkanų padengimas</label>
        <input
          type="text"
          value={company.interestCoverage}
          onChange={(e) =>
            handleCompanyInfoChange("interestCoverage", e.target.value)
          }
        />
      </div>

      <div>
        <label>Grynoji skolos ir EBITDA santykis</label>
        <input
          type="text"
          value={company.netDebtRatio}
          onChange={(e) =>
            handleCompanyInfoChange("netDebtRatio", e.target.value)
          }
        />
      </div>

      <div>
        <label>Grynasis pelningumas</label>
        <input
          type="text"
          value={company.netProfitability}
          onChange={(e) =>
            handleCompanyInfoChange("netProfitability", e.target.value)
          }
        />
      </div>

      <div>
        <label>Pardavimo pajamų pokytis</label>
        <input
          type="text"
          value={company.changeInSalesRevenue}
          onChange={(e) =>
            handleCompanyInfoChange("changeInSalesRevenue", e.target.value)
          }
        />
      </div>

      <button onClick={handleSubmit}>Apskaičiuoti riziką</button>

      {/* <div>Rizikos balas: {score}</div> */}
    </>
  );
}

export default CompanyEvaluation;
