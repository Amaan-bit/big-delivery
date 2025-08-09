"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/app/lib/api";
import { useRouter } from "next/navigation";

type LoginModalProps = {
  isAuthenticated: boolean;
};

export default function AuthModal({ isAuthenticated }: LoginModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  if (!showModal) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginUser({ username, password });

    if (res?.status === "200") {
      setShowModal(false);
      router.refresh();
    } else {
      console.log(res);
      setError(res?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {modalType === "login" ? (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-4" id="loginForm">
            <h2 className="text-xl font-semibold text-center py-2">Login</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold"></strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="flex flex-col">
              <label htmlFor="login_email" className="mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="login_email"
                placeholder="Enter your email"
                className="border border-gray-300 px-3 py-2 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="login_password" className="mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="login_password"
                placeholder="Enter your password"
                className="border border-gray-300 px-3 py-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text-sm text-center">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setModalType("register")}
                  className="text-green-600 font-medium"
                >
                  Register
                </button>
              </p>
            </div>
          </form>
        ) : (
          // Register Form
          <form method="POST" action="/api/register" className="space-y-4" id="registerForm">
            <h2 className="text-xl font-semibold text-center py-2">Register</h2>

            <div className="flex flex-col">
              <label htmlFor="first_name" className="mb-1 text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                className="border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="last_name" className="mb-1 text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                className="border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="register_email" className="mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="register_email"
                className="border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="register_password" className="mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="register_password"
                className="border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirm_password" className="mb-1 text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                className="border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Register
              </button>

              <p className="text-sm text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setModalType("login")}
                  className="text-green-600 font-medium"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
