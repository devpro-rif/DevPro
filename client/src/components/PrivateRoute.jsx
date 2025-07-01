import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Redirect to /login if not logged in
    return <Navigate to="/login" replace />;
  }

  // Render children if user is logged in
  return children;
};

export default PrivateRoute
