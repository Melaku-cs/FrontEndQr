// NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoToSignIn = () => {
    navigate('/auth/signin'); // Adjust the path based on your routing structure
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-100">
      {/* Warning Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="text-yellow-500 w-24 h-24 mb-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 22h20L12 2z" />
        <path d="M12 17v1m0-4v2" />
      </svg>

      {/* Title and Message */}
      <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">The page you are looking for does not exist.</p>

      {/* Diagnostic Information */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Connection Diagnostics</h2>
        <p className="text-sm text-black">
          If you are having trouble connecting, please check the following:
        </p>
        <ul className="list-disc list-inside text-left text-sm text-black">
          <li>Ensure your internet connection is stable.</li>
          <li>Try refreshing the page.</li>
          <li>Check if the URL is correct.</li>
        
        </ul>
      </div>

      {/* Navigation Button */}
      <button
        onClick={handleGoToSignIn}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;