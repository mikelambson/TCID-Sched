// lib/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type UserType = { 
  id: string; 
  name?: string | null; 
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  recheckSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  user: null,
  setUser: () => {},
  recheckSession: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const pathStyle = pathname.includes("/admin") ? "text-white/50" : "text-gray-500";
  const namePathStyle = pathname.includes("/admin") ? "text-yellow-500" : "text-black";

  const recheckSession = useCallback(async () => {
    try {
      console.log("Starting session recheck...");
      const res = await fetch("/api/auth/session", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      console.log("Session check response:", { status: res.status, data });

      if (res.ok && data.user) {
        console.log("Session valid, setting user:", data.user);
        setUser(data.user);
        setLoggedIn(true);
      } else {
        console.log("No valid user in response, clearing state. Response data:", data);
        setUser(null);
        setLoggedIn(false);
      }
    } catch (err) {
      console.error("Session check failed:", err);
      setUser(null);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Initial checking session on mount...");
    recheckSession(); // Only runs on mount for page refresh
  }, [recheckSession]);

  if (loading) {
    return <div className="text-center mt-10 text-yellow-500">Checking session...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, user, setUser, recheckSession }}>
      <div className={`fixed top-4 right-4 font-semibold z-50`}>
        {isLoggedIn && user?.email ? (
          <>
            <span className={`hidden sm:inline text-xs mr-2 ${pathStyle}`}>
              Welcome:
            </span>
            <Link href="/admin/profile" className={`hover:underline cursor-pointer ${namePathStyle}`}>
              {user.name}
            </Link>
          </>
        ) : ""}
      </div>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);