"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const AdminNav = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-neutral-800/90 text-white p-4">
      <ul className="pl-10 flex gap-4 h-6">
        {user?.isAdmin && (
        <li><Link href="/admin">Dashboard</Link></li>
        )}
        {user?.isAdmin && (
          <li><Link href="/admin/users">Users</Link></li>
        )}
        {user?.isAdmin && (
        <li><Link href="/admin/settings">Settings</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default AdminNav;
