import React from "react";
import { useState } from "react";
import { updatePassword } from "../api/userApi";
import styles from "../styles/AccountSettings.module.css";
/**
 * AccountSettings component provides an interface for users to change their password.
 * It includes form inputs for the old password, new password, and confirmation of the new password.
 * The component validates that the new passwords match and submits the update via an API call.
 *
 * Usage:
 * - Users must fill out all fields and submit the form.
 * - The component checks that the new password and confirmation match before submitting.
 * - Feedback is provided based on the success or failure of the password update.
 */
const AccountSettings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage("");

    if (newPassword !== confirmPassword) {
      setFeedbackMessage("New passwords don't match!");
      return;
    }

    try {
      const response = await updatePassword({ oldPassword, newPassword });
      setFeedbackMessage(response.message);
    } catch (error) {
      setFeedbackMessage(error.message);
    }
  };

  return (
    <div className="account-settings">
      <h2>Change Your Password</h2>
      <form onSubmit={handleSubmit} className="password-form">
        <div className="input-group">
          <label>Old Password:</label>
          <input
            data-testid="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>New Password:</label>
          <input
            data-testid="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Confirm New Password:</label>
          <input
            data-testid="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
      {feedbackMessage && (
        <div className="feedback-message">{feedbackMessage}</div>
      )}
    </div>
  );
};

export default AccountSettings;
