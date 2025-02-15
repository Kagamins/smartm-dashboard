'use client';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale } from "chart.js";

// ✅ Register Chart.js elements
ChartJS.register(ArcElement, CategoryScale, Tooltip, Legend);

export default function PieChart({ data }) {
    if (!data || !data.labels || !data.datasets) {
        return <p className="text-center text-red-500">لا توجد بيانات متاحة</p>; // Handle empty data
    }

    // ✅ Adjust options to control the chart size
    const options = {
        maintainAspectRatio: false, // Allows custom height & width
        responsive: true,
    };

    return (
        <div className="w-[300px] h-[300px] mx-auto"> {/* ✅ Set custom width & height */}
            <Pie data={data} options={options} redraw />
        </div>
    );
}
