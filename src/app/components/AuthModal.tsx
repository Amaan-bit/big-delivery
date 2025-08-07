"use client";

import { useState, useEffect } from "react";

type LoginModalProps = {
  isAuthenticated: boolean;
};

export default function AuthModal({ isAuthenticated }: LoginModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-red-600 text-xl font-bold"
        >
          &times;
        </button>

        {modalType === "login" ? (
          // Login Form
          <form method="POST" action="/api/login" className="space-y-4" id="loginForm">
            <input type="hidden" name="user" value="user" />
            <input type="hidden" name="checkout" value="" />

            <h2 className="text-xl font-semibold text-center py-2">Login</h2>

            <div className="flex flex-col">
              <label htmlFor="login_email" className="mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="login_email"
                placeholder="Enter your email"
                className="border border-gray-300 px-3 py-2 rounded"
                required
              />
              <small id="loginEmailError" className="text-red-500 text-xs mt-1"></small>
            </div>

            <div className="flex flex-col">
              <label htmlFor="login_password" className="mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                id="login_password"
                className="border border-gray-300 px-3 py-2 rounded"
                required
              />
              <small id="loginPasswordError" className="text-red-500 text-xs mt-1"></small>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Login
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
