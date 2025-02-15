'use client';
import { useState, useEffect } from "react";
import { supabase } from "@/utils/dataBase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ✅ Function to format date to YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split("T")[0];
}

// ✅ Arabic Weekdays (Sunday - Thursday)
const weekdays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

export default function Report() {
    const [users, setUsers] = useState([]); // List of users
    const [selectedUser, setSelectedUser] = useState(''); // Selected user
    const [selectedDate, setSelectedDate] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [absences, setAbsences] = useState([]);
    const [error, setError] = useState("");

    // ✅ Fetch users from Supabase
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

    // ✅ Fetch Data (Attendance, Permissions, Absences)
    function getDateLabel(dateString) {
        const date = new Date(dateString);
        const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
        const arabicDay = weekdays[date.getDay()];
        return `${arabicDay} - ${formattedDate}`; // **Example: الأحد - 2025-02-11**
    }
    const fetchData = async () => {
        if (!selectedUser || !selectedDate) {
            setError("يرجى اختيار الموظف والشهر أولاً!");
            return;
        }
    
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Ensure MM format
        const lastDay = new Date(year, month, 0).getDate(); // Get last day of the selected month
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
    
        console.log('Fetching data for:', selectedUser, startDate, "to", endDate);
    
        try {
            // ✅ Fetch Attendance
            const { data: attendanceData } = await supabase
                .from("Attendance")
                .select("*")
                .eq("user", selectedUser)
                .gte("created_at", startDate)
                .lte("created_at", endDate);
    
            // ✅ Fetch Permissions
            const { data: permissionsData } = await supabase
                .from("permissions")
                .select("*")
                .eq("user", selectedUser)
                .gte("date", startDate)
                .lte("date", endDate);
    
            // ✅ Fetch Absences
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
    

    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">تقرير الموظف</h1>

            {/* ✅ User Dropdown */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">اختر الموظف</h2>
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="p-2 border rounded-lg w-60 text-black"
                >
                    <option key={0} value=" ">اختر موظف</option>
                    {users.map((user) => (
                        <option key={user.username} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
            </div>

            {/* ✅ Date Picker (Only Sunday - Thursday Selection) */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">اختر الشهر</h2>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM"
                    showMonthYearPicker
                    className="p-2 border rounded-lg w-40 text-black text-center"
                />
            </div>

            <button
                onClick={fetchData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mb-4"
            >
                تحميل البيانات
            </button>

            {error && <p className="text-red-500">{error}</p>}

            {/* ✅ Data Table */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="p-3 border">التاريخ</th>
                            <th className="p-3 border">الحضور</th>
                            <th className="p-3 border">الإستئذانات</th>
                            <th className="p-3 border">الغياب</th>
                        </tr>
                    </thead>
                    <tbody>
    {[...attendance, ...permissions, ...absences]
        .filter(item => weekdays.includes(new Date(item.created_at || item.date).toLocaleDateString("ar-EG", { weekday: "long" })))
        .sort((a, b) => new Date(a.created_at || a.date) - new Date(b.created_at || b.date))
        .map((item) => (
            <tr key={`${item.user}-${item.created_at || item.date}`} className="text-center border-b">
                <td className="p-3 border text-black">{getDateLabel(item.created_at || item.date)}</td>
                <td className="p-3 border text-black">{attendance.some(a => a.created_at === item.created_at) ? "✔" : "❌"}</td>
                <td className="p-3 border text-black">{permissions.some(p => p.date === item.date) ? "✔" : "❌"}</td>
                <td className="p-3 border text-black">{absences.some(a => a.created_at === item.created_at) ? "✔" : "❌"}</td>
            </tr>
        ))}
</tbody>

                </table>
            </div>
        </div>
    );
}
