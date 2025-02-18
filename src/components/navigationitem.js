'use client';
import { useState } from "react";
export function NavItem({ icon, text, link }) {
    
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
