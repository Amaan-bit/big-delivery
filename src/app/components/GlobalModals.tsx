"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/app/components/AuthModal";

export default function GlobalModals() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false); 
      router.push("/"); 
    } else {
      setIsAuthenticated(true); 
    }
  }, [router]);

  return !isAuthenticated ? <AuthModal isAuthenticated={isAuthenticated} /> : null;
}
