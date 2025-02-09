"use client";
import { useState } from "react";
import { loginUser } from "../utils/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await loginUser(username, password);

        console.log("Login API Response:", response); // Debugging Log

        if (response.success) {
            localStorage.setItem("user", JSON.stringify(response.user));
            window.location.href = "/dashboard";
        } else {
            setError(response.error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <form className="bg-white justify-center place-items-center p-6 rounded-lg shadow-lg w-96" onSubmit={handleLogin}>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">تسجيل الدخول</h2>
                
                <div className="mb-4  right-0">
                    <label className="block text-gray-700">الرقم المدني</label>
                    <input 
                        className="w-full mt-1 p-2 border text-black rtl:relative rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        type="text" 
                        placeholder="الرقم المدني" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">رقم الملف</label>
                    <input 
                        className="w-full mt-1 text-black p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        type="text" 
                        placeholder="رقم الملف" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <button 
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                    type="submit">
                    تسجيل الدخول
                </button>

                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            </form>
        </div>
    );
}
