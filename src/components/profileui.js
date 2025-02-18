'use client';
import {LogOut} from 'lucide-react'
import { useState ,useEffect } from 'react';
import Image from 'next/image';
import { NavItem } from './navigationitem';
export default function ProfileUIComponent( ) {
    const [user, setUser] = useState(null);
    
      useEffect(() => {
             const storedUser = localStorage.getItem("user");
             if (!storedUser) {
                 window.location.href = "/login";
             } else {
                 setUser(JSON.parse(storedUser));
              }
         }, []);
          if (!user){
            return(<>
            <h1>
                في إنتظار البيانات
            </h1>
            </>)
         }
         else{
return(
    <> {/* Right Section (User Info & Logout) */}
    <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3">
            <Image  src={user.photo} width={45} height={45} alt="User Profile" className="w-12 h-12 rounded-full border-2 border-white" />
            <span className="text-white text-lg">{user.username.replace(/\.$/, "").trim()}</span>
        </div>
        <NavItem icon={<LogOut size={30} />} text="تسجيل الخروج" link="/" color='bg-cyan-600'/>
    </div>
    </>
)    
}
}
