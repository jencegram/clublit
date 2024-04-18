import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyBookClubs } from "../api/bookClubApi";

/**
 * BookClubs component provides a view that lets users navigate to in-person clubs or create their own book club
 * based on whether they are already part of a club. It checks if the user is part of any book clubs and updates
 * the UI accordingly.
 *
 * Behavior:
 * - On component mount, checks if the user is part of any book clubs using the fetchMyBookClubs API call.
 * - If the user is part of one or more book clubs, it updates the state to reflect this.
 * - Provides a button to navigate to in-person clubs always.
 * - Provides a button to create a new book club only if the user is not part of any clubs.
 */
function BookClubs() {
  const [userHasCreatedClub, setUserHasCreatedClub] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserClubs = async () => {
      try {
        const clubs = await fetchMyBookClubs();
        const userId = localStorage.getItem("userId");
        const hasCreated = clubs.some(
          (club) => club.adminuserid.toString() === userId
        );
        setUserHasCreatedClub(hasCreated);
      } catch (error) {
        console.error("Error fetching the user's book clubs: ", error.message);
      }
    };

    checkUserClubs();
  }, []);

  return (
    <div>
      <h2>Book Clubs</h2>
      <div>
        <button onClick={() => navigate("/in-person-clubs")}>
          In-Person Clubs
        </button>
      </div>
      {!userHasCreatedClub && (
        <button onClick={() => navigate("/createbookclub")}>
          Create Your Book Club
        </button>
      )}
    </div>
  );
}

export default BookClubs;
