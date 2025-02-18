 import { Geist, Geist_Mono } from "next/font/google";
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
  
  return (
    <html lang="ar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopNavigation    />
        {children}


       </body>
    </html>
  );
}
