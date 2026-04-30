import React, { useState } from "react";
import styles from "./InterestCalculator.module.css";
import g_styles from "./Components/general_style.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface CalculatorData {
  startingDeposit: number;
  monthlyDeposit: number;
  interest: number;
  timeInYears: number;
}

function InterestCalculator() {
  const [inputData, setInputData] = useState<CalculatorData>({
    startingDeposit: 0,
    monthlyDeposit: 0,
    interest: 0,
    timeInYears: 0,
  });

  const [finalCashDisplay, setFinalCashDisplay] = useState<string>("");
  const [yourContributionsDisplay, setYourContributionsDisplay] =
    useState<string>("");
  const [growth, setGrowth] = useState<{ month: number; value: number }[]>([]);

  function calculateInterest() {
    const monthlyRate = inputData.interest / 100 / 12;
    const totalMonths = inputData.timeInYears * 12;

    let finalValue =
      inputData.startingDeposit * Math.pow(1 + monthlyRate, totalMonths);

    if (monthlyRate > 0) {
      finalValue +=
        (inputData.monthlyDeposit *
          (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
        monthlyRate;
    } else {
      finalValue += inputData.monthlyDeposit * totalMonths;
    }

    setFinalCashDisplay(
      `${Math.round(finalValue).toLocaleString("en").replaceAll(",", " ")}€`,
    );

    const totalDeposits =
      inputData.monthlyDeposit * totalMonths + inputData.startingDeposit;
    setYourContributionsDisplay(
      `Viso Įnešta ${Math.round(totalDeposits).toLocaleString("en").replaceAll(",", " ")}€`,
    );

    let investmentValue = inputData.startingDeposit;
    const additions: { month: number; value: number }[] = [];

    for (let i = 0; i < totalMonths; i++) {
      investmentValue =
        investmentValue * (1 + monthlyRate) + inputData.monthlyDeposit;
      additions.push({ month: i + 1, value: Math.round(investmentValue) });
    }
    setGrowth(additions);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [id]: value === "" ? 0 : Number(value),
    }));
  };

  return (
    <div className={g_styles.page_wrapper}>
      <div className={g_styles.card}>
        <h1 className={g_styles.card_title}>Palūkanų skaičiuoklė</h1>

        {finalCashDisplay && (
          <div className={styles.resultsCard}>
            <h2 className={styles.sectionTitle}>Rezultatai</h2>
            <p className={styles.resultValue}>{finalCashDisplay}</p>
            <p className={styles.resultSubtext}>{yourContributionsDisplay}</p>
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="startingDeposit">
                Pradinis Įnašas
              </label>
              <input
                className={styles.inputField}
                type="number"
                id="startingDeposit"
                value={inputData.startingDeposit || ""}
                placeholder="Pvz: 2000"
                onChange={handleChange}
                min="0"
                step="100"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="monthlyDeposit">
                Papildomas Mėnesinis Įnašas
              </label>
              <input
                className={styles.inputField}
                type="number"
                id="monthlyDeposit"
                value={inputData.monthlyDeposit || ""}
                placeholder="Pvz: 400"
                onChange={handleChange}
                min="0"
                step="50"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="timeInYears">
                Investicijos terminas (metais)
              </label>
              <input
                className={styles.inputField}
                type="number"
                id="timeInYears"
                value={inputData.timeInYears || ""}
                placeholder="Pvz: 10"
                onChange={handleChange}
                min="1"
                max="50"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="interest">
                Metinės Palūkanos (%)
              </label>
              <input
                className={styles.inputField}
                type="number"
                id="interest"
                value={inputData.interest || ""}
                placeholder="Pvz: 6"
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <button
            className={styles.calculateButton}
            onClick={calculateInterest}
            type="button"
          >
            Skaičiuoti
          </button>
        </div>

        {growth.length > 0 && (
          <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>
              Grafinė investicijos iliustracija
            </h2>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={growth}
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbdfe4" />
                  <XAxis
                    dataKey="month"
                    stroke="#595a5e"
                    label={{
                      value: "MĖN",
                      offset: -5,
                      position: "insideBottom",
                      style: { fill: "#595a5e", fontSize: "0.9rem" },
                    }}
                  />
                  <YAxis
                    stroke="#595a5e"
                    label={{
                      value: "EUR",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#595a5e", fontSize: "0.9rem" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#edf1f5",
                      border: "2px solid #c3c6ca",
                      borderRadius: "0.5rem",
                      boxShadow: "1px 0 7px #dbdfe4",
                    }}
                    labelStyle={{ color: "#000", fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Vertė"
                    stroke="#0062ff"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, stroke: "#1871ff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <p className={styles.disclaimer}>
          Tai yra informacinis rezultatas, kuris remiasi apytiksliais
          skaičiavimais.
        </p>
      </div>
    </div>
  );
}

export default InterestCalculator;
