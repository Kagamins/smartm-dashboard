'use client';
import { useState } from "react";
import { FetchNotices } from "@/utils/noticeFetch";
 function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
export default function NoticesComponent() {
  const [data,setData] = useState([]);
      

            const fetchData = async (e) => {

                      const response =  await FetchNotices();
                    if (response.success) {
                        setData(response.data);
                    } else {
                         setData([]);
                    }
            };

            fetchData()
 return(<>
         <div className="flex-grow p-6 bg-gray-100 flex items-center justify-center w-full">
                <div className="w-full border border-gray-300 bg-white rounded-lg shadow-lg p-4">
                    {data.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-200">
                            {/* Table Header */}
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="p-3 border">التاريخ</th>
                                    <th className="p-3 border">المرفق</th>

                                      <th className="p-3 border">من إطلع على التعميم</th> 
                                     <th className="p-3 border"> المحتوى</th>
                                    <th className="p-3 border">العنوان</th>
                                    <th className="p-3 border"> #</th>
                                  </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index} className="text-center border-b">
                                        <td className="p-3 border text-black">{formatDate(item.created_at)}</td>
                                        
                                        {item.attachement ? (
                                            <td className="p-3 border bg-emerald-500">
                                                <a
                                                target="_blank" 
                                                rel="noopener noreferrer" // ✅ Prevents security risks
                                                href={item.attachement} className="text-white">المرفق</a>
                                            </td>
                                        ) : (
                                            <td className="p-3 border bg-red-500 text-white">لا يوجد مرفق</td>
                                        )}

  

                                        <td className="p-3 border grid grid-cols-5 text-black"> 
                                        {item.signed.map((item,index)=>(
        <p className="     hover:border " key={index}>
            {item}
        </p>
    ))}
                                        </td>


                                        <td className="p-3 border text-black">{item.content}</td>

                                        <td className="p-3 border text-black">{item.title}</td>
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
</>)

}
