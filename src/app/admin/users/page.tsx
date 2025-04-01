"use client";

import ManageUsers from "@/features/users/manageUsers";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Users = () => {
  const { user, isLoggedIn, recheckSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not admin
    if (isLoggedIn && (!user || !user.isAdmin)) {
      router.push("/admin"); // or "/404" or your custom unauthorized page
    }
  }, [user, isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return <div className="p-4 text-center">Checking permissions...</div>;
  }

  if (!user.isAdmin) {
    return null; // optional fallback during redirect
  }

  return (
    <div className="">
      <ManageUsers />
    </div>
  );
};

export default Users;
