'use client';
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/dataBase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import PieChart from '@/components/PieChartComponent';
import html2canvas from "html2canvas";

 // ✅ Function to format date to YYYY-MM-DD
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// ✅ Arabic Weekdays (Sunday - Thursday)
const weekdays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس","الجمعة","السبت"];

export default function Report() {
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [absences, setAbsences] = useState([]);
    const [error, setError] = useState("");
    const reportRef = useRef(null);

    useEffect(() => {
        async function fetchUsers() {

 
            const { data, error } = await supabase.from("users").select("*").order('username',{ascending:true});
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
        const arabicDay = weekdays[date.getDay()];
        return `${arabicDay} - ${formatDate(date)}`;
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

            const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("username", selectedUser);

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

            setUserData(userData || null);
            setAttendance(attendanceData || []);
            setPermissions(permissionsData || []);
            setAbsences(absencesData || []);
            setError("");
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("حدث خطأ أثناء تحميل البيانات");
        }
    };

    // ✅ Generate all weekdays from Sunday to Thursday for the selected month
    const getWeekdaysInMonth = () => {
        const year = selectedDate?.getFullYear();
        const month = selectedDate?.getMonth();
        if (year === undefined || month === undefined) return [];
    
        const today = new Date(); // Current Date
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
        const dates = [];
        const date = new Date(year, month, 1);
    
        while (date.getMonth() === month) {
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            
            // If selected month is current month, stop at today
            if (isCurrentMonth && date > today) break;
    
            if (dayOfWeek >= 0 && dayOfWeek <= 4) { // Sunday to Thursday
                dates.push(formatDate(date));
            }
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };
    
    

    // ✅ Get all weekdays for the selected month
    const allDates = getWeekdaysInMonth();

    // ✅ Count total attendance, permissions, and absences
    const totalAttendance = attendance.length;
    const totalPermissions = permissions.length;
    const totalAbsences = absences.length;

    // ✅ Pie Chart Data
    const pieChartData = {
        labels: ["الحضور", "الإستئذانات", "الغياب"],
        datasets: [
            {
                label: "نسبة البيانات",
                data: [totalAttendance, totalPermissions, totalAbsences],
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
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">تقرير الموظف</h1>

            {/* ✅ User Dropdown */}
            <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="p-2 border rounded-lg w-80 text-black"
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
                className="p-2 border rounded-lg w-40 text-black text-center m-4"
            />

            <button onClick={fetchData} className="bg-blue-500 text-white px-6 py-2 rounded-lg m-4">
                تحميل البيانات
            </button>
            <button onClick={generatePDF} className="bg-green-500 text-white px-6 py-2 rounded-lg m-4">
                تحميل التقرير PDF
            </button>

            {/* ✅ Content to be captured */}
            <div ref={reportRef} className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
                <h1 className='text-black text-center'> تقرير : {selectedUser} </h1>
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
        {allDates.map((date) => (
            <tr key={date} className="text-center border-b">
                <td className="p-3 border text-black">{getDateLabel(date)}</td>
                <td className="p-3 border text-black">{attendance.some(a => formatDate(a.created_at) === date) ? "✔" : "❌"}</td>
                <td className="p-3 border text-black">{permissions.some(p => formatDate(p.date) === date) ? "✔" : "❌"}</td>
                <td className="p-3 border text-black">{absences.some(a => formatDate(a.created_at) === date) ? "✔" : "❌"}</td>
            </tr>
        ))}
    </tbody>
    {/* ✅ Total Row */}
    <tfoot className="bg-gray-200 font-bold">
        <tr className="text-center">
            <td className="p-3 text-black  border">المجموع</td>
            <td className="p-3 text-black  border">{totalAttendance} يوم</td>
            <td className="p-3 text-black border">{totalPermissions} يوم</td>
            <td className="p-3 text-black border">{totalAbsences} يوم</td>
        </tr>
    </tfoot>
</table>

            </div>
        </div>
    );
}
