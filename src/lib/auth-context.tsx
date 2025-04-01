// lib/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";


type UserType = { 
  id: string; 
  name?: string | null; 
  email: string 
  isAdmin: boolean
};

type AuthContextType = {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  user: UserType | null;
  recheckSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  user: null,
  recheckSession: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const pathSyle = pathname.includes("/admin") ? "text-white/50" : "text-gray-500";
  const namePathSyle = pathname.includes("/admin") ? "text-yellow-500" : "text-black";

  const recheckSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    } catch (err) {
      console.error("Session check failed:", err);
      setUser(null);
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    recheckSession().finally(() => setLoading(false));
  }, [recheckSession]);

  if (loading) {
    return <div className="text-center mt-10 text-yellow-500">Checking session...</div>;
  }

  

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, user, recheckSession }}>
      <div className={`fixed top-4 right-4 font-semibold z-50`}>
        {isLoggedIn && user?.email ? (
          <>
            <span className={`hidden sm:inline text-xs mr-2 ${pathSyle}`}>
              Welcome:
            </span>
            <Link href="/admin/profile" className={`hover:underline curser-pointer ${namePathSyle}`}>
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
