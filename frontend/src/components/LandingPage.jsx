import React from "react";
import { Link } from "react-router-dom";

/**
 * LandingPage presents the main entry view of the application with navigation links to log in or sign up.
 *
 * Behavior:
 * - Provides quick navigation options for new or returning users to log in or sign up.
 *
 * Usage:
 * Used as the default route to welcome users and direct them to login or signup routes.
 */

function LandingPage() {
  return (
    <div>
      <h1>Welcome to ClubLit</h1>
      <div>
        <Link to="/login">Log In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default LandingPage;
