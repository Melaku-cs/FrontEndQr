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
  
  // For updating user data
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

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

  // Delete user by ID
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://10.195.49.17:5000/api/user/${id}`);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user');
      }
    }
  };

  // Update user by ID
  const handleUpdate = async (id: number) => {
    try {
      const response = await axios.put(`http://10.195.49.17:5000/api/user/${id}`, formData);
      setUsers(users.map(user => (user.id === id ? response.data : user)));
      setEditUser(null); // Close the edit modal
      setFormData({});
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
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
                      setEditUser(user);
                      setFormData(user);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
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

      {/* Update Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded p-4 w-1/3">
            <h4 className="font-bold">Update User</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editUser.id);
            }}>
              <div className="mb-2">
                <label>First Name:</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Username:</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Phone:</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Gender:</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Address:</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
                <button type="button" onClick={() => setEditUser(null)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDataTable;