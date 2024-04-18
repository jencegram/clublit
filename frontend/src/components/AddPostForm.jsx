import React from "react";
import { useState } from "react";
import { createPost } from "../api/bookClubApi";
import PropTypes from "prop-types";
import styles from "../styles/AddPostForm.module.css";

/**
 * AddPostForm provides a form for users to create new posts within a specific forum.
 * It utilizes the createPost API function to submit new posts to the server.
 * Upon successful submission, it triggers a callback to potentially update the UI,
 * such as refreshing the list of posts.
 *
 * Props:
 * - forumId (string): The ID of the forum where the post will be added.
 * - onPostAdded (function): A callback function that is called after a successful post creation.
 */
function AddPostForm({ forumId, onPostAdded }) {
  const [postContent, setPostContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(forumId, postContent);
      onPostAdded();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <textarea
          className={styles.textarea} 
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Write your post here..."
          required
        />
      </div>
      <button type="submit" className={styles.button}>
        Add Post
      </button>
    </form>
  );
}

AddPostForm.propTypes = {
  forumId: PropTypes.string.isRequired,
  onPostAdded: PropTypes.func.isRequired,
};

export default AddPostForm;
