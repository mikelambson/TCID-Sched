// app/admin/layout.tsx (assuming this is the file)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QueryProvider } from '@/lib/query-provider';
import AdminNav from "@/features/nav/adminNav";
import { useAuth } from "@/lib/auth-context";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, user, recheckSession } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      if (isLoggedIn && user) {
        // If already logged in from auth context, trust it
        setValidSession(true);
        setChecking(false);
      } else {
        // Only fetch if no valid state (e.g., page refresh)
        try {
          await recheckSession(); // Use context's recheckSession
          if (isLoggedIn && user) {
            setValidSession(true);
          } else {
            router.push("/");
          }
        } catch (err) {
          console.error("Session check failed", err);
          router.push("/not-found");
        } finally {
          setChecking(false);
        }
      }
    };

    validateSession();
  }, [isLoggedIn, user, recheckSession, router]);

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