import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

// Define the structure for User and Merchant
interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  gender: string;
  address: string;
}

interface Merchant {
  id: string;
  merchant_category: string;
  merchant_city: string;
  tax_id: string;
  postal_code: string;
  country: string;
  merchant_account: string;
}

// Define the structure of the error response
interface ErrorResponse {
  message: string;
}

const CombinedMerchantUserDisplay: React.FC<{ userId: string }> = ({ userId }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [merchantData, setMerchantData] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!userId) {
      setError('User ID is not defined');
      setLoading(false);
      return;
    }
  
    const fetchData = async () => {
      try {
        const [userResponse, merchantResponse] = await Promise.all([
          axios.get(`http://10.195.49.17:5000/api/user/${userId}`),
          axios.get(`http://10.195.49.17:5000/api/merchants/${userId}`),
        ]);
  
        console.log('Fetched user ID:', userId);
  
        setUserData(userResponse.data);
        setMerchantData(merchantResponse.data);
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        setError(error.response?.data.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h4 className="font-bold text-lg">User and Merchant Information</h4>
      {userData && (
        <div>
          <h5 className="font-semibold">User Information</h5>
          <p><strong>Name:</strong> {userData.first_name} {userData.last_name}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
          <p><strong>Gender:</strong> {userData.gender}</p>
          <p><strong>Address:</strong> {userData.address}</p>
        </div>
      )}
      {merchantData && (
        <div className="mt-4">
          <h5 className="font-semibold">Merchant Information</h5>
          <p><strong>Category:</strong> {merchantData.merchant_category}</p>
          <p><strong>City:</strong> {merchantData.merchant_city}</p>
          <p><strong>Tax ID:</strong> {merchantData.tax_id}</p>
          <p><strong>Postal Code:</strong> {merchantData.postal_code}</p>
          <p><strong>Country:</strong> {merchantData.country}</p>
          <p><strong>Account:</strong> {merchantData.merchant_account}</p>
        </div>
      )}
    </div>
  );
};

export default CombinedMerchantUserDisplay;