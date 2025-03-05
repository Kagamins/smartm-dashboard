"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FetchAbscense } from "@/utils/abscenceFetch";
import { ManageAbscense } from "@/utils/abscenseDecision";
// ✅ Function to format created_at to YYYY-MM-DD
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

  



export default function AbscentTab() {
    const [pickedDate, setPickedDate] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [decision, setDecision] = useState("");
    const [id, setID] = useState(null);
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
        const response = await FetchAbscense(formattedDate, user?.organization);

        if (response.success) {
            setData(response.data);
        } else {
            setError(response.error);
            setData([]);
        }
    };
     const sendData = async () => {
         if (!id || !decision) return;
         const response = await ManageAbscense(id, decision);
         if (response.success) {
             console.log("Permission updated successfully!");
             fetchData;
         } else {
             setError(response.error);
         }
     };
    return (
        <div className="flex-1 flex flex-col items-center p-6">
            {/* Date Picker Input */}
            <div className="mb-4">
                <h2 className="text-xl placeholder-green-800 text-center font-semibold mb-2">الغياب  </h2>
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
                className="bg-blue-500 hover:bg-blue-700 mb-4 text-white px-6 py-2 rounded-lg"
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

                                    <th className="p-3 border">المرفق</th>
                                    <th className="p-3 border">الحالة</th>

                                    <th className="p-3 border">الرد</th>

                                    <th className="p-3 border">الإفادة</th>

                                    <th className="p-3 border">القسم</th>
                                    <th className="p-3 border">الرقم المدني</th>

                                    <th className="p-3 border">الاسم</th>
                                    <th className="p-3 border">#</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
    {data
         
        .map((item, index) => (
            <tr key={index} className="text-center border-b">
                <td className="p-3 border text-black">{formatDate(item.created_at)}</td>
                {item.attachement ? (
    <td className="p-3 border bg-emerald-500">
        <a 
            href={item.attachement} 
            className="text-white" 
            target="_blank" 
            rel="noopener noreferrer" // ✅ Prevents security risks
        >
            المرفق
        </a>
    </td>
) : (
    <td className="p-3 border bg-red-500 text-white">لا يوجد مرفق</td>
)}
                                        {/* ✅ Fix: Proper Conditional Rendering for Management Reply */}
                                        <td className="p-3 justify-items-center border text-black">
                                            {item.status === "في إنتظار رد الإدارة"  ? (
                                           <div className="flex space-x-2 justify-items-center">
                                           <button 
                                               onClick={() => { setID(item.id); setDecision('عذر مقبول'); sendData(); }} 
                                               className="text-green-600 p-2 border rounded-lg"
                                           >
                                               عذر مقبول
                                           </button>
                                           <button 
                                               onClick={() => { setID(item.id); setDecision('عذر غير مقبول'); sendData(); }} 
                                               className="text-red-600 p-2 border rounded-lg"
                                           >
                                               عذر غير مقبول
                                           </button>
                                       </div> ) : (
                                        item.status
                                                
                                            )}
                                        </td>

                                                        <td className="p-3 border text-black">{item.reply}</td>

                <td className="p-3 border text-black">{item.question}</td>

                  <td className="p-3 border text-black">{item.section}</td>
                  <td className="p-3 border text-black">{item.cid}</td>

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
