'use client';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js Components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function ChartComponent({ chartData, horizontal = false }) {
    const options = {
        indexAxis: horizontal ? "x" : "y", // **Make it horizontal**
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: chartData.datasets[0].label },
        },
    };

    return <Bar data={chartData} options={options} />;
}
