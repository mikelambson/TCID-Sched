"use client";
import UploadSchedule from "@/features/schedule/uploadSchedule";

const AdminPage = () => {
    
    return (
        <div className="flex flex-col">
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin panel. Use the navigation to manage the application.</p>
            <UploadSchedule />
        </div>
        
        </div>
    );
};

export default AdminPage;