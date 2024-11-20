import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
  handleLogout: () => Promise<void>;
}

const Logout: React.FC<LogoutProps> = ({ handleLogout }) => {
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>(''); // State for success message
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await handleLogout();
      setLoading(false);
      setSuccessMessage('You have been logged out successfully!'); // Set success message
      clearSuccessMessage(); // Start timer to clear message
      navigate('/auth/signin'); // Redirect after logout
    };

    performLogout();
  }, [handleLogout, navigate]);

  const clearSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // Clear message after 3 seconds
  };

  if (loading) {
    return <div>Logging out, please wait...</div>;
  }

  return (
    <div>
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <div>You have been logged out.</div>
    </div>
  );
};

export default Logout;