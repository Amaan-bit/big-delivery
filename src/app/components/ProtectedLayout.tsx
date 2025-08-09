"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalModals from "@/app/components/GlobalModals";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/"); // redirect to home if no token
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">Loading...</div>
    );
  }

  return (
    <>
      <GlobalModals />
      {children}
    </>
  );
}
