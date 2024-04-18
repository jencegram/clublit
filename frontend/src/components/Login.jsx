import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";

/**
 * Login provides a form for users to enter their credentials and gain access to the application.
 *
 * Props:
 * - setLoginStatus: Function to update login status in the parent component.
 *
 * State:
 * - username: Stores the username input by the user.
 * - password: Stores the password input by the user.
 * - error: Stores any error messages to display related to the login process.
 *
 * Behavior:
 * - On form submission, attempts to authenticate the user with the server.
 * - On successful authentication, stores user details in local storage and updates login status.
 * - Navigates to the dashboard on successful login.
 * - Displays any error messages if login fails.
 */

function Login({ setLoginStatus }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      setLoginStatus(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Log In</h2>
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
        Log In
      </button>
      <div className={styles.linkContainer}>
        Don&apos;t have an account?{" "}
        <Link to="/signup" className={styles.link}>
          Sign Up
        </Link>
      </div>
    </form>
  );
}

Login.propTypes = { setLoginStatus: PropTypes.func.isRequired };

export default Login;
