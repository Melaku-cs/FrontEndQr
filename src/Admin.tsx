import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import TotalMerchant from './pages/TotalMerchant';
import TotalUser from './pages/TotalUser';
import NewAdded from './pages/NewAdded';
import NewMerchant from './pages/NewMerchant';

const AdminPage = () => {
    return (
        <AdminLayout>
            <div className="flex-1 p-8">
                <h1 className="text-3xl text-black font-bold mb-4">Admin Dashboard</h1>
                <p className="mb-6 text-black">
                    Welcome to the admin dashboard.     </p>

                {/* Example Links or Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-400 p-4 rounded h-50 w-80 shadow-lg hover:bg-blue-400">
                        
                       <TotalUser/>
                    </div>
                    <div className="bg-indingo-400 p-4 rounded shadow-lg h-50 w-80 hover:bg-blue-400">
                      
                    <TotalMerchant/>

                    </div>
                    <div>

                        <NewMerchant/>
                    </div>
                    <div>
                    <NewAdded/>
                    </div>
                   
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPage;