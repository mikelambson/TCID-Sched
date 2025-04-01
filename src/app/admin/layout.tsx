"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QueryProvider } from '@/lib//query-provider';
import AdminNav from "@/features/nav/adminNav";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/not-found");
          return;
        }

        const data = await res.json();
        if (data?.user?.email) {
          setValidSession(true);
        } else {
          router.push("/not-found");
        }
      } catch (err) {
        console.error("Session check failed", err);
        router.push("/not-found");
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [router]);

  if (checking) {
    return (
      <div className="text-center mt-10 text-yellow-500">
        Checking session...
      </div>
    );
  }

  if (!validSession) return null;

  return (
    <QueryProvider>
      <div className="pt-14">
        <AdminNav />
        <div>{children}</div>
      </div>
    </QueryProvider>
  );
};

export default AdminLayout;
