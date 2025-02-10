import { supabase } from "@/utils/dataBase";
import ChartComponent from "@/components/ChartComponent";
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

async function fetchAttendanceData() {
    const today = new Date();
    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 6);

    // Format date to YYYY-MM-DD
 
    const pastWeekDate = formatDate(pastWeek);
    const todayDate = formatDate(today);

    // Fetch Attendance Data
    const { data: attendance } = await supabase
        .from("Attendance")
        .select("*")
        .gte("created_at", pastWeekDate);
 
    // Remove duplicate users (Only first record per user per day)
    const uniqueAttendance = [];
    const seenUsers = new Set();
    attendance?.forEach((entry) => {
        const dateKey = entry.created_at?.split("T")[0];
        const uniqueKey = `${entry.user}-${dateKey}`;
        if (!seenUsers.has(uniqueKey)) {
            uniqueAttendance.push(entry);
            seenUsers.add(uniqueKey);
        }
    });

    // Fetch Permissions Data
    const { data: permissions } = await supabase
        .from("Permissions")
        .select("*")
        .gte("date", pastWeekDate);
 
    // Fetch Absences Data
    const { data: absences } = await supabase
        .from("Absences")
        .select("*")
        .gte("created_at", pastWeekDate);
 
    return {
        attendance: uniqueAttendance || [],
        permissions: permissions || [],
        absences: absences || [],
    };
}

 

export default async function Dashboard() {
    const { attendance, permissions, absences } = await fetchAttendanceData();

    // **Arabic Weekday Labels (Sunday - Thursday)**
    const weekdays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

    // **Function to Get Arabic Weekday & Date Label**
    function getDateLabel(dateString) {
        const date = new Date(dateString);
        const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
        const arabicDay = weekdays[date.getDay()];
        return `${arabicDay} - ${formattedDate}`; // **Example: الأحد - 2025-02-11**
    }

    // **Filter Data to Include Only Sunday-Thursday**
    const filteredAttendance = attendance.filter(a => weekdays.includes(getDateLabel(a.created_at).split(" - ")[0]));
    const filteredPermissions = permissions.filter(p => weekdays.includes(getDateLabel(p.created_at).split(" - ")[0]));
    const filteredAbsences = absences.filter(a => weekdays.includes(getDateLabel(a.created_at).split(" - ")[0]));

    // **Extract Unique Days**
    const dates = [...new Set(filteredAttendance.map(a => getDateLabel(a.created_at)))].sort(
        (a, b) => weekdays.indexOf(a.split(" - ")[0]) - weekdays.indexOf(b.split(" - ")[0])
    );

    // **Count Unique Users Per Day**
    const countUnique = (data, dateKey) => {
        const seenUsers = new Set();
        return data.filter(entry => {
            const key = `${entry.user}-${getDateLabel(entry.created_at)}`;
            if (!seenUsers.has(key) && getDateLabel(entry.created_at) === dateKey) {
                seenUsers.add(key);
                return true;
            }
            return false;
        }).length;
    };

    const attendanceCounts = dates.map(date => countUnique(filteredAttendance, date));
    const permissionCounts = dates.map(date => countUnique(filteredPermissions, date));
    const absenceCounts = dates.map(date => countUnique(filteredAbsences, date));

    // **Chart Data Configurations (Horizontal Bar Charts)**
    const attendanceChartData = {
        labels: dates,
        datasets: [
            {
                label: "الحضور",
                data: attendanceCounts,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.5)",
            },
        ],
    };

    const permissionsChartData = {
        labels: dates,
        datasets: [
            {
                label: "الإستئذانات",
                data: permissionCounts,
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.5)",
            },
        ],
    };

    const absencesChartData = {
        labels: dates,
        datasets: [
            {
                label: "الغياب",
                data: absenceCounts,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
            },
        ],
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-6">لوحة البيانات</h1>

            {/* Grid Layout for Side-by-Side Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
                {/* Attendance Chart */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center">إحصائيات الحضور</h2>
                    <ChartComponent chartData={attendanceChartData} horizontal={true} />
                </div>

                {/* Permissions Chart */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center">إحصائيات الإستئذانات</h2>
                    <ChartComponent chartData={permissionsChartData} horizontal={true} />
                </div>

                {/* Absences Chart */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center">إحصائيات الغياب</h2>
                    <ChartComponent chartData={absencesChartData} horizontal={true} />
                </div>
            </div>
        </div>
    );
}
 
