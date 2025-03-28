"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminPage = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col h-screen bg-gray-100">
        {/* <nav className="admin-navbar">
                <ul className="static top-0 left-0 pl-10 flex gap-4 z-50">
                    <li><Link href="/admin/dashboard">Dashboard</Link></li>
                    <li><Link href="/admin/users">Users</Link></li>
                    <li><Link href="/admin/settings">Settings</Link></li>
                </ul>
        </nav> */}
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin panel. Use the navigation to manage the application.</p>
        </div>
        
        </div>
    );
};

export default AdminPage;