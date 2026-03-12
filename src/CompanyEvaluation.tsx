import { useState } from "react";

function CompanyEvaluation() {
  const [quickLiquidityRatio, setQuickLiquidityRatio] = useState<number>(0);
  const [equityRatio, setEquityRatio] = useState<number>(0);
  const [interestCoverage, setInterestCoverage] = useState<number>(0);
  const [netDebtRatio, setNetDebtRatio] = useState<number>(0);
  const [netProfitability, setNetProfitability] = useState<number>(0);
  const [changeInSalesRevenue, setChangeInSalesRevenue] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  async function calculateRisk() {
    let points: number = 0;

    if (quickLiquidityRatio < 0.8) {
      // do nothing
    } else if (quickLiquidityRatio < 1) {
      points += 50;
    } else if (quickLiquidityRatio < 1.2) {
      points += 100;
    } else if (quickLiquidityRatio < 1.5) {
      points += 140;
    } else {
      points += 166.67;
    }

    if (equityRatio < 0.2) {
      // do nothing
    } else if (equityRatio < 0.3) {
      points += 50;
    } else if (equityRatio < 0.4) {
      points += 100;
    } else if (equityRatio < 0.5) {
      points += 140;
    } else {
      points += 166.67;
    }

    if (interestCoverage < 1) {
      // do nothing
    } else if (interestCoverage < 2) {
      points += 50;
    } else if (interestCoverage < 3) {
      points += 100;
    } else if (interestCoverage < 5) {
      points += 140;
    } else {
      points += 166.67;
    }

    if (netDebtRatio > 5) {
      // do nothing
    } else if (netDebtRatio > 4) {
      points += 50;
    } else if (netDebtRatio > 3) {
      points += 100;
    } else if (netDebtRatio > 2) {
      points += 140;
    } else {
      points += 166.67;
    }

    if (netProfitability < 0) {
      // do nothing
    } else if (netProfitability < 5) {
      points += 50;
    } else if (netProfitability < 10) {
      points += 100;
    } else if (netProfitability < 15) {
      points += 140;
    } else {
      points += 166.67;
    }

    if (changeInSalesRevenue < -10) {
      // do nothing
    } else if (changeInSalesRevenue < 0) {
      points += 50;
    } else if (changeInSalesRevenue < 5) {
      points += 100;
    } else if (changeInSalesRevenue < 15) {
      points += 140;
    } else {
      points += 166.67;
    }

    if (points > 1000) {
      points = 1000;
    }

    const score = Math.min(10, Math.floor((1000 - points) / 100) + 1);
    setScore(score);
    console.log(points);
    console.log(score);
  }

  return (
    <>
      <h1>Jurininių asmenų rizikos įvertinimas</h1>

      <div>
        <label>Greitasis likvidumo koeficientas</label>
        <input
          id="qlr"
          name="qlr"
          type="text"
          value={quickLiquidityRatio}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*\.?\d*$/.test(value)) {
              setQuickLiquidityRatio(Number(value));
            }
          }}
        />
      </div>

      <div>
        <label>Nuosavybės koeficientas</label>
        <input
          id="er"
          name="er"
          type="text"
          value={equityRatio}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*\.?\d*$/.test(value)) {
              setEquityRatio(Number(value));
            }
          }}
        />
      </div>

      <div>
        <label>Palūkanų padengimas</label>
        <input
          id="ic"
          name="ic"
          type="text"
          value={interestCoverage}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*\.?\d*$/.test(value)) {
              setInterestCoverage(Number(value));
            }
          }}
        />
      </div>

      <div>
        <label>Grynoji skolos ir EBITDA santykis</label>
        <input
          id="nd"
          name="nd"
          type="text"
          value={netDebtRatio}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*\.?\d*$/.test(value)) {
              setNetDebtRatio(Number(value));
            }
          }}
        />
      </div>

      <div>
        <label>Grynasis pelningumas</label>
        <input
          id="np"
          name="np"
          type="text"
          value={netProfitability}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*\.?\d*$/.test(value)) {
              setNetProfitability(Number(value));
            }
          }}
        />
      </div>

      <div>
        <label>Pardavimo pajamų pokytis</label>
        <input
          id="cisr"
          name="cisr"
          type="text"
          value={changeInSalesRevenue}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*\.?\d*$/.test(value)) {
              setChangeInSalesRevenue(Number(value));
            }
          }}
        />
      </div>

      <button onClick={calculateRisk}>Apskaičiuoti riziką</button>

      <div>Rizikos balas: {score}</div>
    </>
  );
}

export default CompanyEvaluation;
