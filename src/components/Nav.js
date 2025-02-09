/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Home, Users, Folder, Calendar, LogOut } from "lucide-react";

export default function TopNavigation(user ) {
    const userData = user?.user;

    if (!userData) {
        return (
            <div className="flex h-16 bg-cyan-700 text-white items-center justify-center">
                <h1 className="text-lg font-semibold">بإنتظار البيانات...</h1>
            </div>
        );
    }

    return (
        <nav className="bg-cyan-700 text-white flex items-center justify-between px-10 py-4 shadow-md">
            {/* Left Section (Logo) */}
            <div className="text-2xl font-bold">الإدارة الذكية</div>

            {/* Center Section (Navigation Menu) */}
            <ul className="flex space-x-12">
                <NavItem icon={<Calendar size={30} />} text="الحضور و الإنصراف" link="/attendance" color='bg-cyan-600' />
                <NavItem icon={<Folder size={30} />} text="الغياب" link="/absences" color='bg-cyan-600'/>
                <NavItem icon={<Users size={30} />} text="الإستئذانات" link="/permissions" color='bg-cyan-600'/>
                <NavItem icon={<Home size={30} />} text="البيانات الأساسية" link="/dashboard"color='bg-cyan-600' />
            </ul>

            {/* Right Section (User Info & Logout) */}
            <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                    <img src={userData.photo} alt="User Profile" className="w-12 h-12 rounded-full border-2 border-white" />
                    <span className="text-white text-lg">{userData.username.replace(/\.$/, "").trim()}</span>
                </div>
                <NavItem icon={<LogOut size={30} />} text="تسجيل الخروج" link="/" color='bg-cyan-600'/>
            </div>
        </nav>
    );
}

// **Reusable Navigation Item Component with Text Below Icon**
function NavItem({ icon, text, link }) {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            href={link}
            className={`flex flex-col items-center px-6 py-3 rounded-lg transition  duration-300 hover:bg-cyan-600 relative`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {icon}
            <span className={`text-white text-lg font-semibold opacity-0 transition-all duration-500 ease-in-out ${hovered ? "opacity-100 translate-y-2" : "translate-y-0"}`}>
{text}
            </span>
        </a>
    );
}
