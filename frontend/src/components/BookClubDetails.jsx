import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchBookClubDetails,
  updateBookClubDetails,
  fetchForumsByClubId,
  joinBookClub,
  checkMembership,
  leaveBookClub,
} from "../api/bookClubApi";

/**
 * BookClubDetails displays details of a specific book club, including meeting information, announcements, and related forums.
 * It provides functionalities to join, leave, edit, and update book club details depending on the user's membership status and role.
 *
 * Features:
 * - Fetches and displays detailed information of a specific book club using the club's ID from URL parameters.
 * - Allows club members to view meeting information, announcements, and forums associated with the club.
 * - Provides admin users with options to edit and save changes to meeting information and announcements.
 * - Non-members can join the club, and members can leave the club.
 */

function BookClubDetails() {
  const { clubId } = useParams();
  const [clubDetails, setClubDetails] = useState(null);
  const [forums, setForums] = useState([]);
  const [meetingInfo, setMeetingInfo] = useState("");
  const [announcements, setAnnouncements] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const details = await fetchBookClubDetails(clubId);
        setClubDetails(details);

        if (clubId && localStorage.getItem("userId")) {
          const membershipStatus = await checkMembership(clubId);
          const isMember =
            details.adminuserid ===
              parseInt(localStorage.getItem("userId"), 10) ||
            membershipStatus.isMember;
          setIsAdmin(
            details.adminuserid === parseInt(localStorage.getItem("userId"), 10)
          );
          setHasJoined(isMember);

          if (isMember) {
            const forumsData = await fetchForumsByClubId(clubId);
            setForums(forumsData);
            setMeetingInfo(details.meetinginfo || "");
            setAnnouncements(details.announcements || "");
          }
        }
      } catch (error) {
        console.error("Failed to fetch book club details:", error);
      }
    }

    fetchData();
  }, [clubId]);

  const handleEditToggle = () => setIsEditMode(!isEditMode);

  const handleSaveChanges = async () => {
    try {
      const updatedDetails = await updateBookClubDetails(clubId, {
        meetinginfo: meetingInfo,
        announcements,
      });
      setClubDetails((prevDetails) => ({ ...prevDetails, ...updatedDetails }));
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to update book club details", error);
    }
  };

  const handleJoinClub = async () => {
    try {
      await joinBookClub(clubId);
      setHasJoined(true);
      setJoinError("");
    } catch (error) {
      setJoinError(error.toString());
    }
  };

  const handleLeaveClub = async () => {
    try {
      await leaveBookClub(clubId);
      setHasJoined(false);
    } catch (error) {
      console.error("Failed to leave book club:", error);
    }
  };

  return (
    <div>
      <h2>{clubDetails?.clubname}</h2>
      <p>{clubDetails?.description}</p>

      {hasJoined && (
        <>
          <p>
            <strong>Meeting Information:</strong> {meetingInfo}
          </p>
          <p>
            <strong>Announcements:</strong> {announcements}
          </p>

          <h3>Forums</h3>
          {forums.length > 0 ? (
            forums.map((forum) => (
              <div key={forum.forumid}>
                <h4>
                  <Link to={`/forums/${forum.forumid}`}>{forum.title}</Link>
                </h4>
                <p>{forum.description}</p>
              </div>
            ))
          ) : (
            <p>No forums to display</p>
          )}
        </>
      )}

      {!hasJoined && !isAdmin && <button onClick={handleJoinClub}>Join</button>}
      {joinError && <p className="error-message">{joinError}</p>}

      {hasJoined && !isAdmin && (
        <button onClick={handleLeaveClub}>Leave</button>
      )}

      {isAdmin && (
        <button onClick={handleEditToggle}>
          {isEditMode ? "Finish Editing" : "Edit"}
        </button>
      )}

      {isAdmin && isEditMode && (
        <div>
          <div>
            <label>Meeting Info:</label>
            <textarea
              value={meetingInfo}
              onChange={(e) => setMeetingInfo(e.target.value)}
            />
          </div>
          <div>
            <label>Announcements:</label>
            <textarea
              value={announcements}
              onChange={(e) => setAnnouncements(e.target.value)}
            />
          </div>
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={() => setIsEditMode(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default BookClubDetails;
