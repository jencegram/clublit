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
import styles from "../styles/BookClubDetails.module.css";

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

        const currentUserId = parseInt(localStorage.getItem("userId"), 10);

        const membershipStatus = await checkMembership(clubId);

        const isCurrentUserAdmin = details.adminuserid === currentUserId;

        setIsAdmin(isCurrentUserAdmin);
        setHasJoined(isCurrentUserAdmin || membershipStatus.isMember);

        if (isCurrentUserAdmin || membershipStatus.isMember) {
          const forumsData = await fetchForumsByClubId(clubId);
          setForums(forumsData);
          setMeetingInfo(
            details.meetinginfo ? details.meetinginfo.substring(0, 300) : ""
          );
          setAnnouncements(
            details.announcements ? details.announcements.substring(0, 300) : ""
          );
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
      setJoinError("");

      const updatedClubDetails = await fetchBookClubDetails(clubId);

      setMeetingInfo(updatedClubDetails.meetinginfo);
      setAnnouncements(updatedClubDetails.announcements);

      const membershipStatus = await checkMembership(clubId);
      setHasJoined(membershipStatus.isMember);

      if (membershipStatus.isMember) {
        const forumsData = await fetchForumsByClubId(clubId);
        setForums(forumsData);
      }
    } catch (error) {
      console.error(`Error joining club: ${error}`);
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
          <div className={styles.section}>
            <p className={styles.bold}>Meeting Information:</p>
            <p>{meetingInfo}</p>
          </div>

          <div className={styles.section}>
            <p className={styles.bold}>Announcements:</p>
            <p>{announcements}</p>
          </div>

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
        <div className={styles.editSection}>
          <div className={styles.editGroup}>
            <label htmlFor="meetingInfo" className={styles.editLabel}>
              Meeting Info:
            </label>
            <textarea
              id="meetingInfo"
              className={`${styles.input} ${styles.textareaLarge}`}
              value={meetingInfo}
              onChange={(e) => setMeetingInfo(e.target.value)}
              maxLength={650}
            />
          </div>
          <div className={styles.editGroup}>
            <label htmlFor="announcements" className={styles.editLabel}>
              Announcements:
            </label>
            <textarea
              id="announcements"
              className={`${styles.input} ${styles.textareaLarge}`}
              value={announcements}
              onChange={(e) => setAnnouncements(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={handleSaveChanges} className={styles.saveButton}>
              Save Changes
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookClubDetails;
