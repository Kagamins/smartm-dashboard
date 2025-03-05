"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FetchAttendance } from "@/utils/attendanceFetch";

// ✅ Function to format created_at to YYYY-MM-DD
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// ✅ Function to format time to HH:MM AM/PM
function formatTime(timeString) {
    if (!timeString) return "غير متوفر"; // ✅ Show "غير متوفر" if no time

    // ✅ If time format is "HH:MM:SS.SSS", split it to extract the hour & minute
    if (typeof timeString === "string" && timeString.includes(":")) {
        const [hours, minutes] = timeString.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour
        return `${formattedHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
    }

    // ✅ If timeString is a full timestamp, convert it properly
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return "غير متوفر"; // ✅ Check if date is valid

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour

    return `${hours}:${minutes} ${ampm}`;
}



export default function Attendance() {
    const [pickedDate, setPickedDate] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            window.location.href = "/";
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchData = async (e) => {
        e.preventDefault();

        if (!pickedDate) {
            setError("يرجى اختيار تاريخ أولاً!");
            return;
        }

        const formattedDate = formatDate(pickedDate);
        const response = await FetchAttendance(formattedDate, user?.organization);

        if (response.success) {
            setData(response.data);
        } else {
            setError(response.error);
            setData([]);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center p-6">
            {/* Date Picker Input */}
            <div className="mb-4">
                <h2 className="text-xl placeholder-green-800 text-center font-semibold mb-2">الحضور و الإنصراف  </h2>
                <DatePicker
                    selected={pickedDate}
                    onChange={(date) => setPickedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="اختر تاريخ"
                    className="p-2 border rounded-lg w-60 text-black text-center"
                />
            </div>

            {/* Fetch Data Button */}
            <button
                onClick={fetchData}
                className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 p-8 mb-4 space-y-5 rounded-lg"
            >
                تحميل البيانات
            </button>

            {/* Data Table */}
            <div className="flex-grow p-6 bg-gray-100 flex items-center justify-center w-full">
                <div className="w-full border border-gray-300 bg-white rounded-lg shadow-lg p-4">
                    {data.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-200">
                            {/* Table Header */}
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="p-3 border">التاريخ</th>
                                    <th className="p-3 border">توقيع الإنصراف</th>
                                    <th className="p-3 border">توقيع الحضور</th>
                                    <th className="p-3 border">القسم</th>

                                    <th className="p-3 border">الاسم</th>
                                    <th className="p-3 border">#</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
    {data
        .filter((item, index, self) =>
            index === self.findIndex((t) => t.user === item.user) // ✅ Keeps only the first occurrence
        )
        .map((item, index) => (
            <tr key={index} className="text-center border-b">
                <td className="p-3 border text-black">{formatDate(item.created_at)}</td>
                <td className="p-3 border text-black">{formatTime(item.TimeOfDeparture)}</td>
                <td className="p-3 border text-black">{formatTime(item.TimeofArrival)}</td>
                <td className="p-3 border text-black">{item.section}</td>
                <td className="p-3 border text-black">{item.user}</td>
                <td className="p-3 border text-black">{index + 1}</td>
            </tr>
        ))}
</tbody>


                        </table>
                    ) : (
                        <p className="text-gray-500 text-center">لا توجد بيانات متاحة لهذا التاريخ</p>
                    )}
                </div>
            </div>
        </div>
    );
};
