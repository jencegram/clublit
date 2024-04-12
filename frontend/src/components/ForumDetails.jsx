// frontend/src/components/ForumDetails.jsx
import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchForumDetails,
  fetchPostsByForumId,
  checkMembership,
} from "../api/bookClubApi";
import AddPostForm from "./AddPostForm";

/**
 * ForumDetails displays details about a specific forum including posts made within the forum.
 * It also allows authorized users to add new posts if they have joined the associated book club.
 *
 * State:
 * - forum: Contains details of the forum such as title and description.
 * - posts: An array of posts within the forum.
 * - hasJoined: Boolean indicating if the current user has joined the club that hosts the forum.
 * - addingPost: Controls whether the post addition form is displayed.
 *
 * Behavior:
 * - Fetches forum details and posts on component mount or when forumId changes.
 * - Checks user's membership status in the club associated with the forum to allow posting.
 * - Dynamically displays a form to add a new post and updates the list of posts upon new post addition.
 */

function ForumDetails() {
  const { forumId } = useParams();
  const [forum, setForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [addingPost, setAddingPost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const forumDetails = await fetchForumDetails(forumId);
        setForum(forumDetails);

        const postsData = await fetchPostsByForumId(forumId);
        setPosts(postsData);

        const clubId = forumDetails.clubid; 

        const userId = localStorage.getItem("userId"); 
        const membershipStatus = await checkMembership(clubId, userId);
        setHasJoined(membershipStatus.isMember);
      } catch (error) {
        console.error("Failed to fetch forum details or posts", error);
      }
    };

    if (forumId) {
      fetchData();
    }
  }, [forumId]);

  const handlePostAdded = async () => {
    setAddingPost(false);
    try {
      const postsData = await fetchPostsByForumId(forumId);
      setPosts(postsData);
    } catch (error) {
      console.error("Failed to fetch posts after adding new post", error);
    }
  };

  return (
    <div>
      <h2>{forum?.title}</h2>
      <p>{forum?.description}</p>
      {hasJoined && !addingPost && (
        <button onClick={() => setAddingPost(true)}>Add Post</button>
      )}
      {addingPost && (
        <AddPostForm forumId={forumId} onPostAdded={handlePostAdded} />
      )}
      {posts.map((post) => (
        <div key={post.postid}>
          <p>
            <Link to={`/usersbookshelf/${post.authoruserid}`}>
              {post.username}
            </Link>
            : {post.content}
            <br />
            <small>posted on {post.formatted_date}</small>
          </p>
        </div>
      ))}
    </div>
  );
}

export default ForumDetails;
