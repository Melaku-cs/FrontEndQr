import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  userRole: string | null;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userRole, allowedRoles }) => {
  if (!userRole) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Redirect if user does not have access
  }

  return <Outlet />; // Render child routes if authenticated and authorized
};

export default ProtectedRoute;