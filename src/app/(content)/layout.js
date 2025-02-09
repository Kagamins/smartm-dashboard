"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect,useState } from "react";
import "../globals.css";
import TopNavigation from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

 

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
         const storedUser = localStorage.getItem("user");
         if (!storedUser) {
             window.location.href = "/login";
         } else {
             setUser(JSON.parse(storedUser));
          }
     }, []);
  return (
    <html lang="ar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopNavigation user = {user}   />
        {children}


       </body>
    </html>
  );
}
