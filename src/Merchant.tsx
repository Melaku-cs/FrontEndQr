// src/pages/MerchantPage.tsx
import React from 'react';
import DefaultLayout from './layout/DefaultLayout';
import NewAdded from './pages/NewAdded';
import NewMerchant from './pages/NewMerchant';
import TotalMerchant from './pages/TotalMerchant';
import TotalUser from './pages/TotalUser';

const MerchantPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Merchant Dashboard</h2>
        <p className="mb-4">Welcome to your dashboard! Here you can manage your account and view your stats.</p>
        
        {/* Example of some sections you might want to add */}
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
    </DefaultLayout>
  );
};

export default MerchantPage;