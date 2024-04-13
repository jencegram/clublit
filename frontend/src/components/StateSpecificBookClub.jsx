import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchStateSpecificBookClubs } from "../api/bookClubApi";
import styles from "../styles/StateSpecificBookClub.module.css";

function StateSpecificBookClubs() {
  const [bookClubs, setBookClubs] = useState([]);
  const { stateName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubs = await fetchStateSpecificBookClubs(stateName);
        setBookClubs(clubs);
      } catch (error) {
        console.error("Error fetching state-specific book clubs:", error);
      }
    };

    fetchData();
  }, [stateName]);

  return (
    <div>
      <h2>Book Clubs in {stateName}</h2>
      <div className={styles.bookClubsContainer}>
        {bookClubs.length > 0 ? (
          bookClubs.map((club) => (
            <div key={club.clubid} className={styles.bookClubCard}>
              <h3>{club.clubname}</h3>
              <p>{club.description}</p>
              <Link to={`/bookclubs/${club.clubid}`}>View Club</Link>
            </div>
          ))
        ) : (
          <p>No book clubs found in this state.</p>
        )}
      </div>
    </div>
  );
}

export default StateSpecificBookClubs;
