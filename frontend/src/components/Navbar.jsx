import React from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

/**
 * Navbar provides navigation links across the site for logged-in users.
 *
 * Props:
 * - isLoggedIn: Boolean indicating if the user is logged in.
 * - onLogout: Function to handle the user logout process.
 *
 * Behavior:
 * - Renders navigation links to various parts of the application like the dashboard, book clubs, and profile preferences.
 * - Provides a logout button that triggers the logout process.
 * - Navigates to the home page on logout.
 * - Only displays if the user is logged in.
 */

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="navbar">
      <ul className="navList">
        <li className="navItem">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "activeLink" : "")}
          >
            <span>Home Page</span>
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink
            to="/bookclubs"
            className={({ isActive }) => (isActive ? "activeLink" : "")}
          >
            Book Clubs
          </NavLink>
        </li>

        <li className="navItem">
          <NavLink
            to="/profile/preferences"
            className={({ isActive }) => (isActive ? "activeLink" : "")}
          >
            Profile Preferences
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink
            to="/account-settings"
            className={({ isActive }) => (isActive ? "activeLink" : "")}
          >
            Account Settings
          </NavLink>
        </li>

        <li className="navItem">
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  userId: PropTypes.number,
};

export default Navbar;
