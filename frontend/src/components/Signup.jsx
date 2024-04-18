import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Signup.module.css";

/**
 * Signup provides a form for new users to register an account.
 *
 * Props:
 * - setLoginStatus: Function to update login status in the parent component upon successful registration.
 *
 * State:
 * - username, email, password: States for user input.
 * - error: Stores any error messages to display related to the registration process.
 *
 * Behavior:
 * - On form submission, sends user data to the server for registration.
 * - On successful registration, updates login status and navigates to the dashboard.
 * - Displays any error messages if registration fails.
 */

function Signup({ setLoginStatus }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      setLoginStatus(true);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Sign Up</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.label}>
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.button}>
        Sign Up
      </button>
      <div className={styles.linkContainer}>
        Already have an account?{" "}
        <Link to="/login" className={styles.link}>
          Log In
        </Link>
      </div>
    </form>
  );
}

Signup.propTypes = {
  setLoginStatus: PropTypes.func.isRequired,
};

export default Signup;
