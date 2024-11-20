import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  role: string | null;  // Allow null for unauthenticated users
  isLoggedIn: boolean;  // Add isLoggedIn prop
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role, isLoggedIn }) => {
  const isAuthenticated = isLoggedIn && (role === '1' || role === '2'); // Check if user is authenticated

  // Redirect to the appropriate path based on role if necessary
  const redirectPath = isLoggedIn ? (role === '1' ? '/admin' : '/merchant') : '/auth/signin';

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default PrivateRoute;