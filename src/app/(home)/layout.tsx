"use client";

import Link from "next/link";
import { useState } from "react";
import { useApi } from "../utils/generictypeapi";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<string | null>("Demo User");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const api = useApi();

  const handleLogout = async() => {
    try{
       const res = await api.post<object>("/auth/logout");
        if(res) window.location.href = "/login";
    }  catch(err){
       throw err;
    }
   
  };

  const handleChangePassword = () => {
    window.location.href = "/change-password";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-blue-400 text-black py-3 px-6 flex justify-between items-center">
        {/* Left: Project Name */}
        <h1 className="text-lg font-semibold">
          <Link href="/">Supply Chain Management System</Link>
        </h1>

        {/* Right: User dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-300 transition"
            >
              <span className="capitalize">{user}</span>
              <svg
                className={`w-4 h-4 transform transition ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded">
                <button
                  onClick={handleChangePassword}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
