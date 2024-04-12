import React from "react";
import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute is a component that restricts access to certain routes to only authenticated users.
 *
 * Behavior:
 * - Checks if a user is authenticated by verifying the presence of a token in local storage.
 * - Renders the children components if authenticated, otherwise redirects to the login page.
 *
 * Usage:
 * Used in the app router to protect routes that require authentication.
 */

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
