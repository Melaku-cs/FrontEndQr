import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  address: string;
  created_at: string; // Ensure this field exists
}

const RecentUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.195.49.17:5000/api/user');
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sort users by created_at date and get the latest 5
  const recentUsers = users
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5); // Adjust the number to display as needed

  // Function to format the date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="font-bold text-black text-xl mb-4">Recently Registered Users</h3>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {recentUsers.length === 0 ? (
        <p>No recently registered users.</p>
      ) : (
        <div className="overflow-x-auto" id="recentUserTable">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-[#FFA500] text-white">
              <tr>
                <th className="border px-4 py-2">First Name</th>
                <th className="border px-4 py-2">Last Name</th>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Registration Date</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="border px-4 py-2">{user.first_name}</td>
                  <td className="border px-4 py-2">{user.last_name}</td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.phone}</td>
                  <td className="border px-4 py-2">{user.address}</td>
                  <td className="border px-4 py-2">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentUsers;