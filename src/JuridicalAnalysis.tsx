import React, { useEffect, useState } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBoxPlot } from "@nivo/boxplot";
import styles from "./JuridicalAnalysis.module.css";
function JuridicalPortfolioAnalysis() {
    interface RatingData {
        totalScore: number;
        quickLiquidityRatio: number;
        interestCoverage: number;
        netDebtRatio: number;
        netProfitability: number;
        changeInSalesRevenue: number;
        equityRatio: number;

        quickLiquidityPoints: number;
        equityRatioPoints: number;
        interestCoveragePoints: number;
        netDebtRatioPoints: number;
        netProfitabilityPoints: number;
        salesRevenuePoints: number;
    }

    const [evalu, setEvalu] = useState<RatingData[]>([]);

    useEffect(() => {
        async function getAllScores() {
            try {
                const response = await fetch("/api/juridical/get/scores");
                const data = await response.json();
                setEvalu(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        getAllScores();
    }, []);


    // heatmap
    const safeNum = (val: any): number => {
        if (val === null || val === undefined || val === "") return 0;
        const parsed = Number(val);
        return Number.isFinite(parsed) ? parsed : 0;
    };
    const heatmapData = evalu.map((item, index) => ({
        id: `Company ${index + 1}`,
        data: [
            { x: "Quick Liquidity", y: safeNum(item.quickLiquidityPoints) },
            { x: "Equity Ratio", y: safeNum(item.equityRatioPoints) },
            { x: "Interest Coverage", y: safeNum(item.interestCoveragePoints) },
            { x: "Net Debt", y: safeNum(item.netDebtRatioPoints) },
            { x: "Profitability", y: safeNum(item.netProfitabilityPoints) },
            { x: "Sales Revenue", y: safeNum(item.salesRevenuePoints) },
        ],
    }));

    //medzio dia
    const avg = (arr: number[]) =>
        arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

    const treeMapData = {
        name: "Total Score Composition",
        children: [
            { name: "Liquidity", value: Math.max(0.1, avg(evalu.map(e => safeNum(e.quickLiquidityPoints)))) },
            { name: "Equity", value: Math.max(0.1, avg(evalu.map(e => safeNum(e.equityRatioPoints)))) },
            { name: "Interest Coverage", value: Math.max(0.1, avg(evalu.map(e => safeNum(e.interestCoveragePoints)))) },
            { name: "Debt Risk", value: Math.max(0.1, avg(evalu.map(e => safeNum(e.netDebtRatioPoints)))) },
            { name: "Profitability", value: Math.max(0.1, avg(evalu.map(e => safeNum(e.netProfitabilityPoints)))) },
            { name: "Revenue Growth", value: Math.max(0.1, avg(evalu.map(e => safeNum(e.salesRevenuePoints)))) },
        ],
    };

    // stulpelinei
    const cleanNumber = (v: any) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };
    const barData = [
        {
            metric: "Liquidity",
            ...Object.fromEntries(evalu.map((e, i) => [`Company ${i + 1}`, cleanNumber(e.quickLiquidityPoints)]))
        },
        {
            metric: "Equity",
            ...Object.fromEntries(evalu.map((e, i) => [`Company ${i + 1}`, cleanNumber(e.equityRatioPoints)]))
        },
        {
            metric: "Interest Coverage",
            ...Object.fromEntries(evalu.map((e, i) => [`Company ${i + 1}`, cleanNumber(e.interestCoveragePoints)]))
        },
        {
            metric: "Net Debt",
            ...Object.fromEntries(evalu.map((e, i) => [`Company ${i + 1}`, cleanNumber(e.netDebtRatioPoints)]))
        },
        {
            metric: "Profitability",
            ...Object.fromEntries(evalu.map((e, i) => [`Company ${i + 1}`, cleanNumber(e.netProfitabilityPoints)]))
        },
        {
            metric: "Revenue",
            ...Object.fromEntries(evalu.map((e, i) => [`Company ${i + 1}`, cleanNumber(e.salesRevenuePoints)]))
        },
    ];
    //bendriem
    const rawAttributes = [
        { key: "quickLiquidityRatio", label: "Greitasis likvidumo koeficientas" },
        { key: "interestCoverage", label: "Palūkanų padengimas" },
        { key: "netDebtRatio", label: "Paskolų ir EBIT santykis" },
        { key: "netProfitability", label: "Grynasis pelningumas" },
        { key: "changeInSalesRevenue", label: "Pardavimų pajamų pokytis" },
        { key: "equityRatio", label: "Nuosavybės koeficientas" },
    ] as const;
    const getValues = (key: string) =>
        evalu
            .map(e => cleanNumber((e as any)[key]))
            .filter(v => Number.isFinite(v));

    const createHistogram = (values: number[], bins = 5) => {
        if (values.length === 0) return [];

        const min = Math.min(...values);
        const max = Math.max(...values);
        const step = (max - min) / bins || 1;

        const counts = Array(bins).fill(0);

        values.forEach(v => {
            let idx = Math.floor((v - min) / step);
            if (idx === bins) idx--;
            if (idx >= 0) counts[idx]++;
        });

        return counts.map((c, i) => ({
            bin: `${(min + i * step).toFixed(2)}-${(min + (i + 1) * step).toFixed(2)}`,
            count: c,
        }));
    };
    // CDF
    const createCDF = (values: number[]) => {
        const clean = values.filter(v => Number.isFinite(v));

        if (!clean.length) return [];

        const sorted = [...clean].sort((a, b) => a - b);
        const n = sorted.length;

        return sorted.map((v, i) => ({
            x: v,
            y: (i + 1) / n,
        }));
    };
    // box
    const createBoxPlotData = (values: number[], label: string) => {
        return values.map(v => ({
            group: label,
            value: v,
        }));
    };

    // STATISTIKA
    const getMean = (arr: number[]) =>
        arr.reduce((a, b) => a + b, 0) / arr.length;

    const getMedian = (arr: number[]) => {
        const mid = Math.floor(arr.length / 2);

        return arr.length % 2 !== 0
            ? arr[mid]
            : (arr[mid - 1] + arr[mid]) / 2;
    };

    const getQuartile = (arr: number[], q: number) => {
        const pos = (arr.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;

        if (arr[base + 1] !== undefined) {
            return arr[base] + rest * (arr[base + 1] - arr[base]);
        }

        return arr[base];
    };

    const getStdDev = (arr: number[]) => {
        const mean = getMean(arr);

        const variance =
            arr.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
            arr.length;

        return Math.sqrt(variance);
    };

    const getStats = (arr: number[]) => {
        const sorted = [...arr].sort((a, b) => a - b);

        return {
            count: sorted.length,
            mean: getMean(sorted),
            median: getMedian(sorted),
            min: Math.min(...sorted),
            max: Math.max(...sorted),
            q1: getQuartile(sorted, 0.25),
            q3: getQuartile(sorted, 0.75),
            stdDev: getStdDev(sorted),
        };
    };

    const statistics = [
        {
            name: "Reitingas",
            stats: getStats(evalu.map(e => e.totalScore)),
        },
        {
            name: "Greitasis likvidumo koeficientas",
            stats: getStats(evalu.map(e => e.quickLiquidityRatio)),
        },
        {
            name: "Palūkanų padengimas",
            stats: getStats(evalu.map(e => e.interestCoverage)),
        },
        {
            name: "Paskolų ir EBIT santykis",
            stats: getStats(evalu.map(e => e.netDebtRatio)),
        },
        {
            name: "Grynasis pelningumas",
            stats: getStats(evalu.map(e => e.netProfitability)),
        },
        {
            name: "Pardavimų pajamų pokytis",
            stats: getStats(evalu.map(e => e.changeInSalesRevenue)),
        },
        {
            name: "Nuosavybės koeficientas",
            stats: getStats(evalu.map(e => e.equityRatio)),
        },
    ];
    return (
        <div className={styles.page_wrapper}>
            <h2 className={styles.card_title}>
                JURIDINIŲ ASMENŲ PORTFELIO ANALIZĖ
            </h2>

            {/*heatmap*/}
            <div className={styles.dashboard}>
                <div className={`${styles.card} ${styles.heatmapCard}`}>
                    <h5>Šilumos žemėlapis</h5>
                    <p style={{ fontSize: '12px' }}>Nurodomas visų įmonių duomenų rinkinys pagal kiekvieno rodiklio įtaką reitingui, geltona aukščiausias reitingas, tamsi žemiausias.
                    </p>

                    <div style={{ height: 320 }}>
                        <ResponsiveHeatMap
                            data={heatmapData}
                            margin={{ top: 50, right: 10, bottom: 10, left: 10 }}
                            valueFormat=">-.2f"
                            axisTop={{ tickRotation: -45 }}
                            axisLeft={null}
                            colors={{ type: "sequential", scheme: "viridis" }}
                            emptyColor="#eeeeee"
                            borderColor="#ffffff"
                            enableLabels={false}
                            animate
                        />
                    </div>
                </div>

                {/*treemapas */}
                <div className={`${styles.card} ${styles.treemapCard}`}>
                    <h5>Medžio schema</h5>
                    <p style={{ fontSize: '12px' }}>Nurodomas visų įmonių duomenų rinkinys pagal įtaka vertinimo balui</p>
                    <div style={{ height: 300 }} >
                        <ResponsiveTreeMap
                            data={treeMapData}
                            identity="name"
                            value="value"
                            valueFormat=">-.2f"
                            margin={{ top: 68, right: 10, bottom: 10, left: 10 }}
                            labelSkipSize={12}
                            labelTextColor={{ from: "color", modifiers: [["darker", 1.2]] }}
                            parentLabelPosition="left"
                            parentLabelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                            borderColor={{ from: "color", modifiers: [["darker", 0.1]] }}
                            animate
                        />
                    </div>
                </div>
                {/* statistika */}
                <div className={`${styles.card} ${styles.textCard}`}>
                    <h3>Statistika</h3>
                    <p style={{ fontSize: '12px' }}>Nurodoma visų rodiklių bei reitingo statistinių duomenų apžvalga</p>

                    {evalu.length > 0 ? (
                        <div className={styles.statsTableWrapper}>
                            <table className={styles.statsTable}>
                                <thead>
                                    <tr>
                                        <th>Atributas</th>
                                        <th>Kiekis</th>
                                        <th>Vidurkis</th>
                                        <th>Mediana</th>
                                        <th>Min</th>
                                        <th>Max</th>
                                        <th>Q1</th>
                                        <th>Q3</th>
                                        <th>Stand. Nuokrypis</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {statistics.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.stats.count}</td>
                                            <td>{item.stats.mean.toFixed(2)}</td>
                                            <td>{item.stats.median.toFixed(2)}</td>
                                            <td>{item.stats.min.toFixed(2)}</td>
                                            <td>{item.stats.max.toFixed(2)}</td>
                                            <td>{item.stats.q1.toFixed(2)}</td>
                                            <td>{item.stats.q3.toFixed(2)}</td>
                                            <td>{item.stats.stdDev.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Nėra duomenų statistikai.</p>
                    )}
                </div>
                {/* bar plotas */}
                <div className={`${styles.card} ${styles.barCard}`}>
                    <h3>Stulpelinė diagrama</h3>
                    <p style={{ fontSize: '12px' }}>Stulpelinė viso duomenų rinkinio rodklių diagrama</p>
                    <div style={{ height: 300 }}>
                        <ResponsiveBar
                            data={barData}
                            keys={evalu.map((_, i) => `Company ${i + 1}`)}
                            indexBy="metric"
                            margin={{ top: 50, right: 80, bottom: 50, left: 80 }}
                            padding={0.3}
                            groupMode="stacked"
                            valueScale={{ type: "linear" }}
                            indexScale={{ type: "band", round: true }}
                            colors={{ scheme: "category10" }}
                            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                            axisBottom={{
                                tickRotation: -30
                            }}
                            axisLeft={{
                                legend: "Points",
                                legendPosition: "middle",
                                legendOffset: -50
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            animate={true}

                        />
                    </div>
                </div>
                {/* bendro reitingo histo/box/CDF */}
                <div className={`${styles.card} ${styles.totalScoreCard}`}>
                    <h4>Bendras balas</h4>
                    <p style={{ fontSize: "12px" }}>Bendro visų asmenų reitingo histograma, box diagrama ir skirstinio funkcijos grafikas</p>
                   
                    {(() => {
                        const totalValues = evalu.map(x => x.totalScore);

                        const totalHistogram = createHistogram(totalValues);
                        const totalCDF = createCDF(totalValues);
                        const totalBox = createBoxPlotData(totalValues, "Total Score");

                        return (
                            <div className={styles.attributeCharts}>
                                {/* histo */}
                                <div className={styles.chartScoreBox}>
                                    <ResponsiveBar
                                        data={totalHistogram}
                                        keys={["count"]}
                                        indexBy="bin"
                                        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                                        colors={{ scheme: "accent" }}
                                        axisBottom={{ tickRotation: -45 }}
                                        axisLeft={{
                                            legend: "Frequency",
                                            legendPosition: "middle",
                                            legendOffset: -40,
                                        }}
                                    />
                                </div>

                                {/* box */}
                                <div className={styles.chartScoreBox}>
                                    <ResponsiveBoxPlot
                                        data={totalBox}
                                        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                                        minValue={Math.min(...totalValues)}
                                        maxValue={Math.max(...totalValues)}
                                        padding={0.5}
                                        layout="vertical"
                                        axisBottom={{
                                            tickValues: 5,
                                        }}
                                        colors={{ scheme: "accent" }}
                                    />
                                </div>

                                {/* CDF */}
                                <div className={styles.chartScoreBox}>
                                    <ResponsiveLine
                                        data={[
                                            {
                                                id: "Total Score",
                                                data: totalCDF,
                                            },
                                        ]}
                                        margin={{ top: 10, bottom: 20, left: 25, right: 4 }}
                                        xScale={{ type: "linear" }}
                                        yScale={{ type: "linear", min: 0, max: 1 }}
                                        axisBottom={{
                                            legend: "Value",
                                            legendOffset: 30,
                                            legendPosition: "middle",
                                            tickValues: 5
                                        }}
                                        axisLeft={{
                                            legendPosition: "middle",
                                            tickValues: [0, 0.25, 0.5, 0.75, 1],
                                            tickPadding: 5,
                                        }}
                                        pointSize={4}
                                        useMesh={true}
                                        enableGridX={true}
                                        enableGridY={true}
                                        colors={{ scheme: "accent" }}
                                    />
                                </div>
                            </div>
                        );
                    })()}
                </div>
                {/* rodikliu histo/box/CDF */}
                <div className={`${styles.card} ${styles.sidePanelCard}`}>
                    <h3>Rodiklių analizė</h3>
                    <p style={{ fontSize: '12px', marginBottom: 10, marginTop: 4 }}>Nurodomi visų vertinimui naudojamų rodiklių histogramos, dėžutės diagramos ir skirstinio funkcijos grafikai</p>

                    <div className={styles.sidePanel}>
                        {rawAttributes.map(attr => {
                            const values = getValues(attr.key);

                            const histogram = createHistogram(values);
                            const cdf = createCDF(values);
                            const box = createBoxPlotData(values, attr.label);

                            return (
                                <div key={attr.key} className={""} >
                                    <h4>{attr.label}</h4>
                                    {/*histo */}
                                    <div className={styles.attributeCharts}>
                                        <div className={styles.chartBox}>
                                            <ResponsiveBar
                                                data={histogram}
                                                keys={["count"]}
                                                indexBy="bin"
                                                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                                                colors={{ scheme: "nivo" }}
                                                axisBottom={{ tickRotation: -45 }}
                                                axisLeft={{ legend: "Frequency", legendPosition: "middle", legendOffset: -40 }}
                                            />
                                        </div>

                                        {/* box */}
                                        <div className={styles.chartBox}>
                                            <ResponsiveBoxPlot
                                                data={box}
                                                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                                                minValue={Math.min(...values)}
                                                maxValue={Math.max(...values)}
                                                padding={0.5}
                                                layout="vertical"
                                                // axisLeft={null}
                                                axisBottom={{
                                                    tickValues: 5
                                                }}
                                            />
                                        </div>

                                        {/* CDF */}
                                        <div className={styles.chartBox}>
                                            <ResponsiveLine
                                                data={[
                                                    {
                                                        id: attr.label,
                                                        data: cdf,
                                                    },
                                                ]}
                                                margin={{ top: 10, bottom: 20, left: 25, right: 4 }}
                                                xScale={{ type: "linear" }}
                                                yScale={{ type: "linear", min: 0, max: 1 }}
                                                axisBottom={{
                                                    legend: "Value",
                                                    legendOffset: 30,
                                                    legendPosition: "middle",
                                                    tickValues: 5
                                                }}
                                                axisLeft={{
                                                    legendPosition: "middle",
                                                    tickValues: [0, 0.25, 0.5, 0.75, 1],
                                                    tickPadding: 5
                                                }}
                                                pointSize={4}
                                                useMesh={true}
                                                enableGridX={true}
                                                enableGridY={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>


            </div>
        </div>
    );
}

export default JuridicalPortfolioAnalysis;