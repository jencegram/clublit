import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/LandingPage.module.css";
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
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to ClubLit</h1>
      <div className={styles.links}>
        <Link to="/login" className={styles.link}>Log In</Link>
        <Link to="/signup" className={styles.link}>Sign Up</Link>
      </div>
    </div>
  );
}

export default LandingPage;
