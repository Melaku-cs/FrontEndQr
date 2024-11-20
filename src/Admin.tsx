import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';

const AdminPage = () => {
    return (
        <AdminLayout>
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                <p className="mb-6">
                    Welcome to the admin dashboard.     </p>

                {/* Example Links or Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Link to="/UserProfile" className="bg-blue-400 p-4 rounded h-50 w-80 shadow-lg hover:bg-blue-400">
                        <h2 className="text-xl font-bold text-black">View Users</h2>
                        <p>View and manage user accounts.</p>
                    </Link>
                    <Link to="/Merchants" className="bg-blue-400 p-4 rounded shadow-lg h-50 w-80 hover:bg-blue-400">
                        <h2 className="text-xl font-bold text-black">View Merchants</h2>
                       
                    </Link>
                    
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPage;