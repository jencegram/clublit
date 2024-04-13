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
      <h1 className={styles.title}>Explore the World of Books with ClubLit</h1>
      <p className={styles.introText}>
        Join a vibrant community of book enthusiasts. Discover your next great read, 
        participate in book clubs, and share your thoughts in lively discussions. 
        Whether you&apos;re a literary aficionado or looking for your next favorite novel, 
        ClubLit is your go-to place for all things books.
      </p>
      <div className={styles.links}>
        <Link to="/login" className={styles.link}>Log In</Link>
        <Link to="/signup" className={styles.link}>Sign Up</Link>
      </div>
    </div>
  );
}

export default LandingPage;
