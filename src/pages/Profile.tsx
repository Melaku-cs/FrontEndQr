// src/pages/Profile.tsx
import React, { useState, useRef, useEffect } from 'react';

const Profile: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const username = localStorage.getItem('username') || 'Guest';
  const profileImage = localStorage.getItem('userProfileImage') || '/path/to/default/image.png';
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsPopupOpen(false);
      setIsChangePasswordOpen(false); // Close change password popup if clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      // Call your API to change the password (replace with your API logic)
      // Example:
      // await api.changePassword(currentPassword, newPassword);
      
      // Simulate success
      setSuccessMessage('Password changed successfully!');
      // Reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="relative">
      {/* Button to toggle profile popup */}
      <button
        onClick={togglePopup}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
      >
        View Profile
      </button>

      {/* Popup for Profile */}
      {isPopupOpen && (
        <div ref={popupRef} className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
          <div className="flex items-center p-4">
            <img src={profileImage} alt="Profile" className="w-12 h-12 rounded-full" />
            <div className="ml-3">
              <p className="text-lg font-semibold">{username}</p>
              <button
                onClick={() => setIsChangePasswordOpen(!isChangePasswordOpen)}
                className="text-blue-500 hover:underline"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Change Password Form */}
          {isChangePasswordOpen && (
            <form onSubmit={handleChangePassword} className="p-4">
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}
              
              <div className="mb-3">
                <label className="block text-sm">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm">Confirm New Password</label>
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

          <div className="border-t">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="w-full text-left p-2 hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;