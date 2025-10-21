"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "../../utils/generictypeapi";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const api = useApi();
 const changePassword = async (
  newPassword: string,
  confirmPassword: string
): Promise<boolean> => {
  // Optional: simple validation before API call
  if (newPassword !== confirmPassword) {
    console.error("Passwords do not match!");
    return false;
  }

  // Example POST request to backend
  const res = await api.post<boolean>("/auth/change-password", {
    newPassword,
    confirmPassword,
  });
  
  return res.data;
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New and Confirm password do not match!");
      return;
    }

    //const res = await changePassword(newPassword,confirmPassword);

    //Mock API call (replace with actual backend call)
   
    setTimeout(() => {
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect back to dashboard after short delay
      setTimeout(() => router.push("/"), 1500);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full sm:w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Change Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-blue-500"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
