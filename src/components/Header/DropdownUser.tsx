import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png'; // Default image
import axios from 'axios';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [formData, setFormData] = useState({
    first_name: localStorage.getItem('first_name') || '',
    last_name: localStorage.getItem('last_name') || '',
    username: localStorage.getItem('username') || 'Guest',
    phone: localStorage.getItem('phone') || '',
    gender: localStorage.getItem('gender') || '',
    address: localStorage.getItem('address') || '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId') || '';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setIsProfileEditOpen(false);
    setIsChangePasswordOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/signin');
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      const response = await axios.post(
        `http://10.195.49.17:5000/api/auth/change-password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangePasswordOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  const handleProfileUpdate = async () => {
    setError('');
    setSuccessMessage('');

    if (!formData.first_name || !formData.last_name || !formData.username || !formData.phone) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.put(
        `http://10.195.49.17:5000/api/auth/user/${userId}`, // Use PUT for updating
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local storage with new values
      Object.entries(formData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      setSuccessMessage('Profile updated successfully!');
      setIsProfileEditOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-4 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-bold text-black dark:text-white">
            {localStorage.getItem('userRole')}
          </span>
          <span className="block text-xs font-bold text-black">{formData.username}</span>
        </span>

        <span className="h-12 w-12 rounded-full overflow-hidden">
          <img src={UserOne} alt="User" className="object-cover w-full h-full" />
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-bold text-black">Profile</h3>
            <div className="flex items-center mt-2">
              <img src={UserOne} alt="Profile" className="w-12 h-12 rounded-full" />
              <div className="ml-3">
                <p className="text-md font-bold text-black">{formData.username}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsProfileEditOpen(!isProfileEditOpen);
                setIsChangePasswordOpen(false);
              }}
              className="block text-blue-600 hover:underline mt-4"
            >
              Edit Profile
            </button>

            {isProfileEditOpen && (
              <div className="mt-2">
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Last Name"
                  required
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Username"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Phone Number"
                  required
                />
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Gender"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Address"
                />
                <button
                  onClick={handleProfileUpdate}
                  className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Update Profile
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setIsChangePasswordOpen(!isChangePasswordOpen);
                setIsProfileEditOpen(false);
              }}
              className="block text-blue-600 hover:underline mt-4"
            >
              Change Password
            </button>

            {isChangePasswordOpen && (
              <form onSubmit={handleChangePassword} className="mt-2">
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                <div className="mb-3">
                  <label className="block text-sm font-bold text-black">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-bold text-black">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-bold text-black">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-bold text-black duration-300 ease-in-out hover:text-blue-600"
          >
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;