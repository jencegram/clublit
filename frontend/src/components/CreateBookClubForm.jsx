import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBookClub, fetchStates } from "../api/bookClubApi";

/**
 * CreateBookClubForm allows users to create a new book club.
 * It includes fields for the club's name, description, state, and city.
 *
 * State:
 * - clubName: Name of the club being created.
 * - description: Description of the club.
 * - clubType: Type of the club (fixed to 'In-Person').
 * - state: The state where the club is located.
 * - city: The city where the club is located.
 * - states: Array of states fetched from the API for selection.
 *
 * Behavior:
 * - On component mount, fetches a list of states from the API to populate the state selection dropdown.
 * - The form submission will create a new book club and navigate to its details page.
 */

function CreateBookClubForm() {
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [clubType] = useState("In-Person");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStates = async () => {
      const statesData = await fetchStates();
      setStates(statesData);
    };
    loadStates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newClubData = {
        clubName,
        description,
        clubType,
        state,
        city,
      };
      const newClub = await createBookClub(newClubData);
      navigate(`/bookclubs/${newClub.clubid}`);
    } catch (error) {
      console.error("Error creating book club:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={clubName}
        onChange={(e) => setClubName(e.target.value)}
        placeholder="Club Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      ></textarea>
      <select value={state} onChange={(e) => setState(e.target.value)} required>
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        required
      />
      <button type="submit">Create Book Club</button>
    </form>
  );
}

export default CreateBookClubForm;
