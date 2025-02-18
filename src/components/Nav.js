
import { Home, Users, Folder, Calendar, Bell ,Receipt } from "lucide-react";
import ProfileUIComponent from "./profileui";
import { NavItem } from "./navigationitem";
export default function TopNavigation(  ) {
 
  

    return (
        <nav className="bg-cyan-700 text-white flex items-center justify-between px-10 py-4 shadow-md">
            {/* Left Section (Logo) */}
            <div className="text-2xl font-bold">الإدارة الذكية</div>

            {/* Center Section (Navigation Menu) */}
            <ul className="flex space-x-12">
                <NavItem icon={<Receipt size={30} />} text="تقرير الحالة" link="/report"color='bg-cyan-600' />
                <NavItem icon={<Calendar size={30} />} text="الحضور و الإنصراف" link="/attendance" color='bg-cyan-600' />
                <NavItem icon={<Folder size={30} />} text="الغياب" link="/absences" color='bg-cyan-600'/>
                <NavItem icon={<Users size={30} />} text="الإستئذانات" link="/permissions" color='bg-cyan-600'/>
                <NavItem icon={<Home size={30} />} text="البيانات الأساسية" link="/dashboard"color='bg-cyan-600' />
                <NavItem icon={<Bell size={30} />} text="  التعاميم " link="/notices"color='bg-cyan-600' />


            </ul>

            <ProfileUIComponent/>
        </nav>
    );
}

// **Reusable Navigation Item Component with Text Below Icon**
 