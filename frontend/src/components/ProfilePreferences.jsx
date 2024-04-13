// frontend/src/components/ProfilePreferences.jsx
import React from "react";
import { useState, useEffect } from "react";
import {
  fetchGenres,
  updateUserPreferences,
  getUserPreferences,
} from "../api/bookClubApi";
import styles from "../styles/ProfilePreferences.module.css";

/**
 * ProfilePreferences allows users to set and update their favorite genre and book quote.
 *
 * Behavior:
 * - Fetches and displays a list of genres from the server.
 * - Allows the user to select their favorite genre and enter a favorite book quote.
 * - Submits the selected preferences to the server to update user details.
 *
 * State:
 * - genres: Array of genres fetched from the server.
 * - selectedGenre: The currently selected genre ID.
 * - favoriteQuote: The user's favorite book quote.
 * - isUpdated: Boolean to trigger re-fetch after updates.
 */

const ProfilePreferences = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [favoriteQuote, setFavoriteQuote] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const loadPreferencesAndGenres = async () => {
      try {
        const preferences = await getUserPreferences();
        const allGenres = await fetchGenres();
        setGenres(allGenres);

        const favoriteGenreId = allGenres.find(
          (g) => g.genre_name === preferences.favoriteGenre
        )?.genre_id;
        setSelectedGenre(favoriteGenreId || "");

        setFavoriteQuote(preferences.favoriteBookQuote);
      } catch (error) {
        console.error("Error loading genres or preferences:", error);
      }
    };

    loadPreferencesAndGenres();
  }, [isUpdated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const genreId = Number(selectedGenre);

    const preferencesToSave = {
      favoriteGenre: genreId,
      favoriteBookQuote: favoriteQuote,
    };

    try {
      const response = await updateUserPreferences(preferencesToSave);
      if (response.success) {
        setIsUpdated((prev) => !prev);
      } else {
        console.error(
          "An error occurred while updating preferences:",
          response.message
        );
      }
    } catch (error) {
      console.error("An error occurred while updating preferences:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Profile Preferences</h2>
      {isUpdated && (
        <div className={styles.successMessage}>Preferences updated successfully!</div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Genres dropdown */}
        <div className={styles.formGroup}></div>
        <label htmlFor="genre-select" className={styles.formLabel}>
          <strong>Favorite Genre:</strong>
        </label>
        <select
          id="genre-select"
          className={styles.formSelect}
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          required
        >
          <option value="">Select a genre</option>
          {genres.map((genre) => (
            <option key={genre.genre_id} value={genre.genre_id}>
              {genre.genre_name}
            </option>
          ))}
        </select>

        {/* Favorite book quote */}
        <div className={styles.formGroup}></div>
        <label htmlFor="favorite-quote"  className={styles.formLabel}>
          <strong>Favorite Book Quote:</strong>
        </label>
        <textarea
          id="favorite-quote"
          className={styles.favoriteQuoteTextarea} 
          value={favoriteQuote}
          onChange={(e) => setFavoriteQuote(e.target.value)}
          maxLength="300"
          required
          rows="6"
          cols="50"
        ></textarea>

        <button type="submit"className={styles.formButton}>Save Preferences</button>
      </form>
    </div>
  );
};

export default ProfilePreferences;
