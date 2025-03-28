// lib/auth-context.tsx
"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext<{
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}>({
  isLoggedIn: false,
  setLoggedIn: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
        <div className="fixed top-3 right-3 text-yellow-500 font-semibold text-xl ">
            {isLoggedIn === true ? "Logged In" : ""}
        </div>
        
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
