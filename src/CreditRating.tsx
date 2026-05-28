import React, { useState } from "react";
import styles from "./CreditRating.module.css";
import g_styles from "./Components/general_style.module.css";

interface CalculatorData {
  netIncome: number;
  monthlyPayments: number;
  dependents: number;
  interest: number;
  timeInYears: number;
}

function CreditRatingCalculator() {
  const [inputData, setInputData] = useState<CalculatorData>({
    netIncome: 0,
    monthlyPayments: 0,
    dependents: 0,
    interest: 0.04,
    timeInYears: 15,
  });

  const [debtDisplay, setDebtDisplay] = useState<string>("");

  function calculateRating() {
    const familyValue = inputData.netIncome - inputData.dependents * 450;
    const incomeDebtRatio =
      inputData.netIncome * 0.4 - inputData.monthlyPayments;

    const maxDebt =
      (Math.min(familyValue, incomeDebtRatio) *
        (1 -
          Math.pow(1 + inputData.interest / 12, -inputData.timeInYears * 12))) /
      (inputData.interest / 12);

    if (maxDebt < 0) {
      setDebtDisplay(`0€`);
    } else {
      setDebtDisplay(
        `${Math.round(maxDebt).toLocaleString("en").replaceAll(",", " ")}€`,
      );
    }
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
        <h1 className={g_styles.card_title}>Paskolos skaičiuoklė</h1>

        {debtDisplay && (
          <div className={styles.resultsCard}>
            <h2 className={styles.sectionTitle}>Rezultatai</h2>
            <p className={styles.resultValue}>
              Galima paskolos suma: {debtDisplay}
            </p>
            <p className={styles.resultSubtext}>
              Paskaičiuota pagal įvestus duomenis
            </p>
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="netIncome">
                Jūsų ir sutuoktinio grynosios mėnesio pajamos
              </label>
              <input
                className={styles.inputField}
                type="number"
                id="netIncome"
                value={inputData.netIncome || ""}
                placeholder="Pvz: 2000"
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="monthlyPayments">
                Bendra įmokų suma už turimas šeimos paskolas
              </label>
              <input
                className={styles.inputField}
                type="number"
                id="monthlyPayments"
                value={inputData.monthlyPayments || ""}
                placeholder="Pvz: 400"
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="dependents">
                Išlaikytinių šeimoje skaičius
              </label>
              <input
                className={styles.inputField}
                type="number"
                id="dependents"
                value={inputData.dependents || ""}
                placeholder="Pvz: 2"
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="timeInYears">
                Paskolos terminas (metais)
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
          </div>

          <button
            className={styles.calculateButton}
            onClick={calculateRating}
            type="button"
          >
            Skaičiuoti
          </button>
        </div>

        <p className={styles.disclaimer}>
          Tai yra informacinis rezultatas, kuris remiasi apytiksliais
          skaičiavimais.
        </p>
      </div>
    </div>
  );
}

export default CreditRatingCalculator;
