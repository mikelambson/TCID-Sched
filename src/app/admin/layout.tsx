"use client";
import AdminNav from "@/features/nav/adminNav";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="pt-14">
            <AdminNav />
            <div className="">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;