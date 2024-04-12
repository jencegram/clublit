import React from "react";
import { useEffect, useState } from "react";
import { fetchForumsByClubId } from "../api/bookClubApi";
import PropTypes from "prop-types";

/**
 * ForumList displays a list of forums associated with a specific book club.
 * It fetches forum data from the server using the clubId prop.
 *
 * Props:
 * - clubId: The ID of the book club whose forums are to be displayed.
 *
 * State:
 * - forums: An array of forum objects fetched from the server.
 *
 * Behavior:
 * - On component mount or when clubId changes, it fetches the list of forums.
 * - Displays each forum's title and description in the list.
 */
function ForumList({ clubId }) {
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const getForums = async () => {
      try {
        const forumData = await fetchForumsByClubId(clubId);
        setForums(forumData);
      } catch (error) {
        console.error("Failed to fetch forums", error);
      }
    };

    getForums();
  }, [clubId]);

  return (
    <div>
      {forums.map((forum) => (
        <div key={forum.forumid}>
          <h3>{forum.title}</h3>
          <p>{forum.description}</p>
        </div>
      ))}
    </div>
  );
}

ForumList.propTypes = {
  clubId: PropTypes.string.isRequired,
};

export default ForumList;
