"use client";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js Components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function ChartComponent({ chartData, horizontal = false }) {
    const options = {
        indexAxis: horizontal ? "x" : "y", // ✅ Fix: Use "y" for horizontal bar charts
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: chartData.datasets.length > 1
                    ? "إحصائيات الأقسام"
                    : chartData.datasets[0]?.label || "إحصائيات",
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw} أشخاص`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
            },
            y: {
                ticks: { font: { size: 14 } },
            },
        },
    };

    return (
        <div className="w-full h-80">
            <Bar data={chartData} options={options} />
        </div>
    );
}
