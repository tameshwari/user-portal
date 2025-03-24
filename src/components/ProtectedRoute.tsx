import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = Boolean(localStorage.getItem('auth-token'));

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element; 
};

export default ProtectedRoute;
