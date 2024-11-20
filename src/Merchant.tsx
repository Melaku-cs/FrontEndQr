// src/pages/MerchantPage.tsx
import React from 'react';
import DefaultLayout from './layout/DefaultLayout';

const MerchantPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Merchant Dashboard</h2>
        <p className="mb-4">Welcome to your dashboard! Here you can manage your account and view your stats.</p>
        
        {/* Example of some sections you might want to add */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-semibold">Account Information</h3>
          <p>Username: merchant_username</p>
          <p>Email: merchant@example.com</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
          <ul>
            <li>Transaction 1 - $100</li>
            <li>Transaction 2 - $250</li>
            <li>Transaction 3 - $75</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold">Actions</h3>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">View Reports</button>
          <button className="bg-green-500 text-white py-2 px-4 rounded ml-2">Manage Products</button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MerchantPage;