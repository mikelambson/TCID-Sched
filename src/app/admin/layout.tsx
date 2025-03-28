"use client";
import AdminNav from "@/features/nav/adminNav";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <AdminNav />
           {children}
            
            
        </div>
    );
};

export default AdminLayout;