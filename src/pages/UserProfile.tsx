import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSortUp, FaSortDown, FaPrint, FaDownload } from 'react-icons/fa';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  gender: string;
  address: string;
}

const UserProfile: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(5);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<string>('first_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    setError(''); // Reset error state before fetching
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
    if (!formData.first_name || !formData.last_name || !formData.username) {
      setError('First name, last name, and username are required.');
      return;
    }

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

  // Handle sorting
  const handleSort = (field: string) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  // Print function
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write('<html><head><title>User Data</title></head><body>');
      printWindow.document.write('<h3>Registered Users</h3>');
      printWindow.document.write(`<table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
      `);
      filteredUsers.forEach(user => {
        printWindow.document.write(`
          <tr>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.username}</td>
            <td>${user.phone}</td>
            <td>${user.gender}</td>
            <td>${user.address}</td>
          </tr>
        `);
      });
      printWindow.document.write('</tbody></table>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Download function
  const handleDownload = () => {
    const headers = 'First Name,Last Name,Username,Phone,Gender,Address\n';
    const csv = users.map(user => `${user.first_name},${user.last_name},${user.username},${user.phone},${user.gender},${user.address}`).join('\n');
    const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user =>
      ['first_name', 'last_name', 'username', 'phone'].some(field =>
        user[field as keyof User]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField as keyof User];
      const bValue = b[sortField as keyof User];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

      {/* Search Input */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by first name, last name, username, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 w-25"
        />
        <button
          onClick={() => setCurrentPage(1)} // Reset to first page on search
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Print and Download Buttons */}
      <div className="mb-4 flex justify-end">
        <button onClick={handlePrint} className="mr-2 p-2 bg-blue-500 text-white rounded">
          <FaPrint /> Print
        </button>
        <button onClick={handleDownload} className="p-2 bg-green-500 text-white rounded">
          <FaDownload /> Download CSV
        </button>
      </div>

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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,45,50].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto" id="userTable">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-[#FFA500] text-white">
            <tr>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('first_name')}>
                First Name {sortField === 'first_name' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('last_name')}>
                Last Name {sortField === 'last_name' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('username')}>
                Username {sortField === 'username' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('phone')}>
                Phone {sortField === 'phone' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('gender')}>
                Gender {sortField === 'gender' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('address')}>
                Address {sortField === 'address' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
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
                        setFormData({ ...user });
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
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center border px-4 py-2 text-red-500">
                  No results match your search.
                </td>
              </tr>
            )}
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
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Username:</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Phone:</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Gender:</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Address:</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
                <button type="button" onClick={() => setEditUser(null)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;