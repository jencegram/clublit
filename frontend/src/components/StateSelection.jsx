import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/StateSelection.module.css";

/**
 * StateSelection displays a list of states for users to select for in-person club activities.
 *
 * State:
 * - states: Array of states fetched from the server.
 *
 * Behavior:
 * - Fetches a list of states from the server on component mount.
 * - Displays each state as a clickable element that navigates to state-specific in-person clubs.
 */

function StateSelection() {
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/states");
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    };

    fetchStates();
  }, []);

  return (
    <div>
      <h2>Select Your State for In-Person Clubs</h2>
      <div className={styles.container}>
        {states.map((state) => (
          <div
            key={state.id}
            onClick={() => navigate(`/in-person-clubs/${encodeURIComponent(state.name)}`)}
            className={styles.stateBlock}
          >
            {state.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StateSelection;
