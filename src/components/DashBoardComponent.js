import { supabase } from "@/utils/dataBase";
import ChartComponent from "@/components/ChartComponent";

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
}
// ✅ Fetch Data from Supabase
async function fetchData() {
    const today = new Date();
    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 6);

    const pastWeekDate = formatDate(pastWeek);

    // ✅ Fetch Attendance Data
    const { data: attendance } = await supabase
        .from("Attendance")
        .select("*")
        .gte("created_at", pastWeekDate);

    // ✅ Fetch Permissions Data
    const { data: permissions } = await supabase
        .from("permissions")
        .select("*")
        .gte("date", pastWeekDate);

    // ✅ Fetch Absences Data
    const { data: absences } = await supabase
        .from("statements")
        .select("*")
        .gte("created_at", pastWeekDate);

    return {
        attendance: attendance || [],
        permissions: permissions || [],
        absences: absences || [],
    };
}

export default async function DashBoardComponent () { 
        const { attendance, permissions, absences } = await fetchData();
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
 

 

    // ✅ Extract Unique Sections
    const sectionNames = [
        ...new Set([
            ...attendance.map((a) => a.section),
            ...permissions.map((p) => p.section),
            ...absences.map((a) => a.section),
        ]),
    ];
     // **Extract Unique Days**
     const dates = [...new Set(filteredAttendance.map(a => getDateLabel(a.created_at)))].sort(
        (a, b) => weekdays.indexOf(a.split(" - ")[0]) - weekdays.indexOf(b.split(" - ")[0])
    );

    // ✅ Count Unique Users per Section per Day
    const countUniqueBySection = (data, dateKey, section) => {
        const seenUsers = new Set();
        return data.filter(entry => {
            const key = `${entry.user}-${getDateLabel(entry.created_at)}`;
            if (!seenUsers.has(key) && getDateLabel(entry.created_at) === dateKey && entry.section === section) {
                seenUsers.add(key);
                return true;
            }
            return false;
        }).length;
    };

    // ✅ Generate Chart Datasets by Section
    const createChartDatasets = (data, labelPrefix) =>
        sectionNames.map((section, index) => ({
            label: `${labelPrefix} - ${section}`,
            data: dates.map(date => countUniqueBySection(data, date, section)),
            borderColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
            backgroundColor: `hsl(${(index * 60) % 360}, 70%, 70%)`
        }));

    const attendanceChartData = {
        labels: dates,
        datasets: createChartDatasets(attendance, ""),
    };

    const permissionsChartData = {
        labels: dates,
        datasets: createChartDatasets(permissions, ""),
    };

    const absencesChartData = {
        labels: dates,
        datasets: createChartDatasets(absences, ""),
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-6">لوحة البيانات</h1>

            {/* Grid Layout for Charts */}
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



