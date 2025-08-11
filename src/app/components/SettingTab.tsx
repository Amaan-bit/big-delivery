'use client';

import { useState } from 'react';
import Image from 'next/image';
import { changePassword } from '@/app/lib/api';

export default function SettingTab() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changeLoading, setChangeLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("");
  
      if (newPassword !== confirmPassword) {
        setMessage("New password and confirmation do not match.");
        return;
      }
  
      try {
        setChangeLoading(true);
        await changePassword(oldPassword, newPassword, confirmPassword);
        setMessage("✅ Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error ) {
        if (typeof error === "object" && error !== null && "message" in error) {
          setMessage((error as { message?: string }).message || "❌ Failed to change password.");
        } else {
          setMessage("❌ Failed to change password.");
        }
      } finally {
        setChangeLoading(false);
      }
    };

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choose Avatar</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {[...Array(6)].map((_, idx) => (
            <div className='shadow-md p-3 flex justify-center items-center' key={idx}>
                <Image
                src="/images/05.png"
                alt={`Avatar ${idx + 1}`}
                width={180}
                height={80}
                className="cursor-pointer hover:scale-105 transition-transform"
                />
            </div>
        ))}
        </div>

        <div className="space-y-4 shadow-md p-4">
            <h3 className="text-lg font-semibold mt-4">Change Password</h3>
            {message && (
                <div
                className={`px-4 py-3 rounded relative ${
                    message.includes("✅")
                    ? "bg-green-100 border border-green-400 text-green-700"
                    : "bg-red-100 border border-red-400 text-red-700"
                }`}
                role="alert"
                >
                <strong className="font-bold"></strong>
                <span className="block sm:inline">{message}</span>
                </div>
            )}
            <form className="space-y-4 max-w-md" onSubmit={handleChangePassword}>
                <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                required
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                />
                <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                />
                <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                />
                <button
                type="submit"
                disabled={changeLoading}
                className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
                >
                {changeLoading ? "Changing..." : "Change"}
                </button>
            </form>
        </div>
    </div>
  );
}
