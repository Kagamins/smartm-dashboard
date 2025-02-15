'use client';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ✅ Register Chart.js elements properly
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
    if (!data || !data.labels || !data.datasets) {
        return <p className="text-center text-red-500">لا توجد بيانات متاحة</p>; // Handle empty data
    }

    return <Pie data={data} redraw />;
}
