import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token expired, clear and redirect
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error('Invalid token:', err);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  // Token valid, allow access
  return children;
}

export default ProtectedRoute;
