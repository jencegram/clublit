import React from "react";
import { useState } from "react";
import PropTypes from "prop-types"; 
import { createPost } from "../api/bookClubApi";

/**
 * CreatePost provides a form for users to add a new post to a forum.
 * It only displays if the user has permission to post (canPost prop).
 *
 * Props:
 * - forumId: The ID of the forum where the post will be added.
 * - canPost: Boolean indicating whether the user can post to this forum.
 *
 * State:
 * - content: Text content of the post being created.
 *
 * Behavior:
 * - The form captures user input for the post content and submits it to create a new post.
 * - Prevents submission of empty content.
 * - Resets the content state on successful submission.
 */

function CreatePost({ forumId, canPost }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return; 
    try {
      await createPost(forumId, content);
      setContent(""); 
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  if (!canPost) return null;

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post here..."
      />
      <button type="submit">Post</button>
    </form>
  );
}

CreatePost.propTypes = {
  forumId: PropTypes.string.isRequired, 
  canPost: PropTypes.bool.isRequired,
};

export default CreatePost;
