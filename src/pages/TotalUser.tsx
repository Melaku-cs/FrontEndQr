import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  gender: string;
  address: string;
}

const UserCount: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch users from the API to get the count
  const fetchUserCount = async () => {
    try {
      const response = await axios.get('http://10.195.49.17:5000/api/user');
      setUserCount(response.data.length); // Assuming the response is an array of users
    } catch (err) {
      setError('Error fetching user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h3 className="font-bold text-black text-xl mb-4">Total Users</h3>
      {loading && <p>Loading user count...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <p className="text-lg">Total Users: <strong>{userCount}</strong></p>
    </div>
  );
};

export default UserCount;