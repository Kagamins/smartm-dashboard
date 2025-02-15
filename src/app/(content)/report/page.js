'use client';
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/dataBase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import PieChart from '@/components/PieChartComponent';
import html2canvas from "html2canvas";

// ✅ Function to format date to YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split("T")[0];
}

// ✅ Arabic Weekdays (Sunday - Thursday)
const weekdays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

export default function Report() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [absences, setAbsences] = useState([]);
    const [error, setError] = useState("");
    const reportRef = useRef(null); // ✅ Reference for capturing screenshot

    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase.from("users").select("*");
            if (error) {
                console.error("Error fetching users:", error);
                return;
            }
            setUsers(data || []);
        }
        fetchUsers();
    }, []);

    function getDateLabel(dateString) {
        const date = new Date(dateString);
        const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
        const arabicDay = weekdays[date.getDay()];
        return `${arabicDay} - ${formattedDate}`;
    }

    const fetchData = async () => {
        if (!selectedUser || !selectedDate) {
            setError("يرجى اختيار الموظف والشهر أولاً!");
            return;
        }

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const lastDay = new Date(year, month, 0).getDate();
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

        console.log("Fetching data for:", selectedUser, startDate, "to", endDate);

        try {
            const { data: attendanceData } = await supabase
                .from("Attendance")
                .select("*")
                .eq("user", selectedUser)
                .gte("created_at", startDate)
                .lte("created_at", endDate);

            const { data: permissionsData } = await supabase
                .from("permissions")
                .select("*")
                .eq("user", selectedUser)
                .gte("date", startDate)
                .lte("date", endDate);

            const { data: absencesData } = await supabase
                .from("statements")
                .select("*")
                .eq("user", selectedUser)
                .gte("created_at", startDate)
                .lte("created_at", endDate);

            console.log(attendanceData, permissionsData, absencesData);

            setAttendance(attendanceData || []);
            setPermissions(permissionsData || []);
            setAbsences(absencesData || []);
            setError("");
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("حدث خطأ أثناء تحميل البيانات");
        }
    };

    // ✅ Collect all unique dates across Attendance, Permissions, and Absences
    const allDates = new Set();
    attendance.forEach((item) => allDates.add(getDateLabel(item.created_at)));
    permissions.forEach((item) => allDates.add(getDateLabel(item.date)));
    absences.forEach((item) => allDates.add(getDateLabel(item.created_at)));

    const sortedDates = [...allDates]
        .filter(date => weekdays.includes(new Date(date).toLocaleDateString("ar-EG", { weekday: "long" })))
        .sort((a, b) => new Date(a) - new Date(b));

    // ✅ Pie Chart Data
    const pieChartData = {
        labels: ["الحضور", "الإستئذانات", "الغياب"],
        datasets: [
            {
                label: "نسبة البيانات",
                data: [attendance.length, permissions.length, absences.length],
                backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
                borderWidth: 1,
            },
        ],
    };

    const generatePDF = async () => {
        const element = reportRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
        pdf.save(`تقرير_${selectedUser}.pdf`);
    };

    return (
        <div  className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">تقرير الموظف</h1>

            {/* ✅ User Dropdown */}
            <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="p-2 border rounded-lg w-60 text-black"
            >
                <option key={0} value="">اختر موظف</option>
                {users.map((user) => (
                    <option key={user.username} value={user.username}>{user.username}</option>
                ))}
            </select>

            {/* ✅ Date Picker */}
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="إختر الشهر"
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="p-2 border rounded-lg w-40 text-black text-center mb-4"
            />

            <button onClick={fetchData} className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-4">
                تحميل البيانات
            </button>

            {/* ✅ Content to be captured */}
            <div ref={reportRef} className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4">
                {selectedUser ? (<h1 className=' text-black text-center' >  تقرير  : {selectedUser}  </h1>): (<h1 className=' text-black text-center' > لم يتم إختيار الموظف </h1>)} 
                <PieChart data={pieChartData} />

                {/* ✅ Data Table */}
                <table className="w-full border-collapse border border-gray-300 mt-6">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="p-3 border">التاريخ</th>
                            <th className="p-3 border">الحضور</th>
                            <th className="p-3 border">الإستئذانات</th>
                            <th className="p-3 border">الغياب</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedDates.map((date) => (
                            <tr key={date} className="text-center border-b">
                                <td className="p-3 border text-black">{getDateLabel(date)}</td>
                                <td className="p-3 border text-black">
                                    {attendance.some(a => getDateLabel(a.created_at) === date) ? "✔" : "❌"}
                                </td>
                                <td className="p-3 border text-black">
                                    {permissions.some(p => getDateLabel(p.date) === date) ? "✔" : "❌"}
                                </td>
                                <td className="p-3 border text-black">
                                    {absences.some(a => getDateLabel(a.created_at) === date) ? "✔" : "❌"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button onClick={generatePDF} className="bg-green-500 text-white px-6 py-2 rounded-lg mt-4">
                تحميل التقرير PDF
            </button>
        </div>
    );
}
