"use client";

import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";

export default function GlobalModals() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Replace with your actual auth logic (localStorage, cookies, etc.)
    // const token = localStorage.getItem("token");
    setIsAuthenticated(false);
  }, []);

  return <AuthModal isAuthenticated={isAuthenticated} />;
}
