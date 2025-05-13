import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth(); // Use isLoading to prevent premature redirects
  const location = useLocation();

  // While checking authentication, maybe show a loading indicator or null
  // This prevents redirecting before the auth state is confirmed after a refresh
  if (isLoading) {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 text-gray-400">
            Checking authentication...
        </div>
    ); // Or a spinner component
  }

  if (!user) {
    // User not logged in, redirect to login page
    // Pass the current location in state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, render the child route components
  return <Outlet />;
};

export default ProtectedRoute;
