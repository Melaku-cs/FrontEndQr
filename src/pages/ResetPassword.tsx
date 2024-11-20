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

const UserDataTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(5);
  
  // For resetting password
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>(''); // State for success message

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
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

  // Reset password for a user
  const handleResetPassword = async (id: number) => {
    try {
      await axios.put(`http://10.195.49.17:5000/api/user/${id}/reset-password`, { password: newPassword });
      setSuccessMessage('Password reset successfully!'); // Set success message
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
      setResetPasswordUser(null); // Close the reset password modal
      setNewPassword('');
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password');
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h3 className="font-bold text-black text-xl mb-4">Registered Users</h3>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>} {/* Success message display */}

      {/* Users Per Page Selection */}
      <div className="mb-4 flex justify-between">
        <div>
          <label htmlFor="usersPerPage" className="mr-2 text-black">Users per page:</label>
          <select
            id="usersPerPage"
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {[1,2,3,4,5,6,7,8,9,10].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto" id="userTable">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-[#FFA500] text-white">
            <tr>
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentUsers.map((user, index) => (
              <tr key={user.id} className={`border-b ${index % 2 === 0 ? "bg-[#EAF4FF] text-black" : "bg-[#A4D1FF]"}`}>
                <td className="border px-4 py-2">{user.first_name}</td>
                <td className="border px-4 py-2">{user.last_name}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.phone}</td>
                <td className="border px-4 py-2">{user.gender}</td>
                <td className="border px-4 py-2">{user.address}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      setResetPasswordUser(user);
                      setNewPassword(''); // Clear the input for new password
                    }}
                    className="text-orange-500 hover:text-orange-700"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded p-4 w-1/3">
            <h4 className="font-bold">Reset Password for {resetPasswordUser.username}</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword(resetPasswordUser.id);
            }}>
              <div className="mb-2">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Reset Password</button>
                <button type="button" onClick={() => setResetPasswordUser(null)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDataTable;