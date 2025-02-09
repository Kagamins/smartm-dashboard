"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FetchAttendance } from "@/utils/attendanceFetch";
import { FetchPermissions } from "@/utils/permissionsFetch";
import { FetchAbscense } from "@/utils/abscenceFetch";

// ✅ Function to format date to YYYY-MM-DD

function formatDateToLocal(date) {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ✅ Function to filter unique users based on `user` field
function getUniqueUsers(data) {
    return [...new Set(data.map(item => item.user))].length;
}

export default function Dashboard() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [user, setUser] = useState(null);
    const [attendanceCount, setAttendanceCount] = useState(0);
    const [permissionsCount, setPermissionsCount] = useState(0);
    const [absencesCount, setAbsencesCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // ✅ Load User Data from Local Storage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            window.location.href = "/login";
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ Fetch Data Based on Date & Organization
    const fetchData = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const formattedDate = formatDateToLocal(selectedDate);

            // ✅ Fetch Attendance Data & Filter Unique Users
            const attendanceResponse = await FetchAttendance(formattedDate, user.organization);
            if (attendanceResponse.success) {
                setAttendanceCount(getUniqueUsers(attendanceResponse.data));
            }

            // ✅ Fetch Permissions Data & Filter Unique Users
            const permissionsResponse = await FetchPermissions(formattedDate, user.organization);
            if (permissionsResponse.success) {
                setPermissionsCount(getUniqueUsers(permissionsResponse.data));
            }

            // ✅ Fetch Absences Data & Filter Unique Users
            const absencesResponse = await FetchAbscense(formattedDate, user.organization);
            if (absencesResponse.success) {
                setAbsencesCount(getUniqueUsers(absencesResponse.data));
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Dashboard Header */}
            <h1 className="text-4xl font-bold text-gray-800 mb-6">📊 لوحة التحكم</h1>

            {/* Date Picker & Fetch Button */}
            <div className="mb-6 flex items-center gap-4">
                <h2 className="text-xl text-gray-700 font-semibold">اختر التاريخ:</h2>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="p-2 border rounded-lg w-40 text-center text-black"
                />
                <button 
                    onClick={fetchData} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg"
                >
                    تحميل البيانات
                </button>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {/* Attendees Card */}
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h2 className="text-2xl font-bold">الحضور</h2>
                    {loading ? (
                        <p className="text-lg mt-2">جاري التحميل...</p>
                    ) : (
                        <p className="text-5xl font-bold mt-2">{attendanceCount}</p>
                    )}
                </div>

                {/* Permissions Card */}
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h2 className="text-2xl font-bold">الإستئذانات</h2>
                    {loading ? (
                        <p className="text-lg mt-2">جاري التحميل...</p>
                    ) : (
                        <p className="text-5xl font-bold mt-2">{permissionsCount}</p>
                    )}
                </div>

                {/* Absences Card */}
                <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h2 className="text-2xl font-bold">الغياب</h2>
                    {loading ? (
                        <p className="text-lg mt-2">جاري التحميل...</p>
                    ) : (
                        <p className="text-5xl font-bold mt-2">{absencesCount}</p>
                    )}
                </div>
            </div>

            {/* Placeholder for more data */}
            <div className="w-full max-w-5xl items-center mt-6 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl text-center font-semibold text-gray-700">📌 نظرة عامة</h3>
                <p className="text-gray-600 text-center mt-2">يمكنك رؤية ملخص الحضور، الإستئذانات، والغياب لهذا اليوم.</p>
            </div>
        </div>
    );
}
