"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FetchPermissions } from "@/utils/permissionsFetch";
import { ManagePermissions } from "@/utils/permissionDecision";
import { fetchOrganizations } from "@/utils/fetchOrgNames";
import { DeletePermissions } from "@/utils/permissionDelete";
// Function to format date correctly in "YYYY-MM-DD" without shifting days
function formatDateToLocal(date) {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}



export default function PermissionsTab() {
    const [pickedDate, setPickedDate] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [decision, setDecision] = useState("");
    const [id, setID] = useState(null);
    const [organizationList,setOrganizationsList]=useState([]);
    const [organization,setOrganization]=useState('');

    useEffect(() => {
        fetchOrg();

        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            window.location.href = "/";
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, []);  // ✅ Fix: Added dependency array to prevent re-renders

    const sendData = async () => {
        if (!id || !decision) return;
        const response = await ManagePermissions(id, decision);
        if (response.success) {
            console.log("Permission updated successfully!");
            fetchData;
        } else {
            setError(response.error);
        }
    };
    const deleteData = async () => {
        if (!id) return;
         const response = await DeletePermissions(id);
        if (response.success) {
            console.log("Permission deleted successfully!");
            fetchData;
        } else {
            setError(response.error);
        }
    };
    const fetchOrg= async(e)=> {
        const repsonseorg = await fetchOrganizations();
        if (repsonseorg.success) {
            setOrganizationsList(repsonseorg.data);
        } else {
            setOrganizationsList(repsonseorg.error);
            setData([]);
        }
    };
    const fetchData = async (e) => {
        e.preventDefault();
        
        if (!pickedDate) {
            setError("يرجى اختيار تاريخ أولاً!"); 
            return;
        }
        
        // ✅ Corrected date formatting to prevent -1 day issue
        const formattedDate = formatDateToLocal(new Date(pickedDate));
        
        const response = await FetchPermissions(formattedDate,  organization);
    
        if (response.success) {
            setData(response.data);
        } else {
            setError(response.error);
            setData([]);
        }
    };
    

    return (
        <div className="flex-1 flex flex-col justify-items-center items-center p-6">
            {/* Date Picker Input */}
            <div className="mb-4   -space-y-1.5">
                <h2 className="text-xl   text-center font-semibold mb-6">الإستئذانات  </h2>
                <DatePicker
                    selected={pickedDate}
                    onChange={(date) => setPickedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="اختر تاريخ"
                    className="p-2 border rounded-lg w-60 text-black text-center"
                />
            </div>
            {/* ✅ organization Dropdown */}
            <select
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="p-2 border mb-4 rounded-lg w-80 text-black"
            >
                <option key={0} value="">اختر المؤسسة</option>
                {organizationList.map((org) => (
                    <option key={org.name} value={org.name}>{org.name}</option>
                ))}
            </select>
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
                                <th className="p-3 border">إلغاء</th>
 
                                    <th className="p-3 border">التاريخ</th>
                                    <th className="p-3 border">كشف التوقيع</th>
                                    <th className="p-3 border">النوع</th>
                                    <th className="p-3 border">الحالة</th> 
                                    <th className="p-3 border">رد الإدارة</th>
                                    <th className="p-3 border">رد رئيس القسم</th>
                                    <th className="p-3 border">القسم</th>
                                    <th className="p-3 border">الرقم المدني</th>
                                    <th className="p-3 border">الاسم</th>
                                    <th className="p-3 border">#</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index} className="text-center border-b">
                                        <td className="p-3 border text-black"> 
                                        <button 
                                               onClick={() => { setID(item.id);   deleteData(); }} 
                                               className="text-green-600 p-2 border rounded-lg"
                                           >
                                            إلغاء الإستئذان
</button>
                                        </td>

                                        <td className="p-3 border text-black">{item.date}</td>
                                        
                                        {item.attachement ? (
                                            <td className="p-3 border bg-emerald-500">
                                                <a
                                                target="_blank" 
                                                rel="noopener noreferrer" // ✅ Prevents security risks
                                                href={item.attachement} className="text-white">الكشف</a>
                                            </td>
                                        ) : (
                                            <td className="p-3 border bg-red-500 text-white">لا يوجد كشف</td>
                                        )}

                                        <td className="p-3 border text-black">{item.case}</td>
                                        <td className="p-3 border text-black">{item.purpose}</td>  

                                        {/* ✅ Fix: Proper Conditional Rendering for Management Reply */}
                                        <td className="p-3 justify-items-center border text-black">
                                            {item.management_reply === "بإنتظار رد الإدارة"  ? (
                                           <div className="flex space-x-2 justify-items-center">
                                           <button 
                                               onClick={() => { setID(item.id); setDecision('موافقه'); sendData(); }} 
                                               className="text-green-600 p-2 border rounded-lg"
                                           >
                                               موافقة
                                           </button>
                                           <button 
                                               onClick={() => { setID(item.id); setDecision('رفض'); sendData(); }} 
                                               className="text-red-600 p-2 border rounded-lg"
                                           >
                                               رفض
                                           </button>
                                       </div> ) : (
                                        item.management_reply
                                                
                                            )}
                                        </td>

                                        <td className="p-3 border text-black">{item.section_head_reply}</td>
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
}
