import React, { useState } from "react";
import PropTypes from "prop-types";
import { searchBooks } from "../api/bookApi";
import styles from "../styles/BookSearch.module.css";

/**
 * BookSearch provides a form for searching books via the Open Library API.
 * It displays search results and allows the user to add a book from the results.
 *
 * Props:
 * - onAdd: Function to handle adding a book from search results.
 * - showResults: Boolean indicating whether to show search results.
 * - setShowResults: Function to set the visibility of search results.
 *
 * State:
 * - query: Search query entered by the user.
 * - searchResults: Array of books returned from the search.
 * - error: Error message to display for failed searches or no results.
 *
 * Behavior:
 * - Users can enter a search term and submit the form to perform a search.
 * - Displays up to 10 search results with an option to add a book to the user's collection.
 * - Provides a button to hide the search results.
 */

const BookSearch = ({ onAdd, showResults, setShowResults }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.docs) {
        setSearchResults(data.docs.slice(0, 10));
        setShowResults(true);
      } else {
        setError("No results found.");
      }
    } catch (error) {
      console.error("Failed to fetch:", error.message);
      setError("Failed to fetch results.");
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={styles.searchButton} type="submit">
          Search
        </button>
        {isLoading && <div className={styles.loader}>Loading...</div>}
        {showResults && (
          <button
            className={styles.hideResultsButton}
            onClick={() => setShowResults(false)}
          >
            Hide Results
          </button>
        )}
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {showResults && (
        <ul className={styles.searchResults}>
          {searchResults.map((book, index) => (
            <li key={index} className={styles.searchResultItem}>
              {book.title} by{" "}
              {book.author_name
                ? book.author_name.join(", ")
                : "Unknown Author"}
              <button className={styles.addButton} onClick={() => onAdd(book)}>
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

BookSearch.propTypes = {
  onAdd: PropTypes.func.isRequired,
  showResults: PropTypes.bool.isRequired,
  setShowResults: PropTypes.func.isRequired,
};

export default BookSearch;
