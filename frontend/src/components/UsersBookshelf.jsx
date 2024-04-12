import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchUsersFinishedBooks } from "../api/bookApi";
import { getUserPreferences } from "../api/bookClubApi";
import { fetchCurrentlyReadingForUser } from "../api/bookApi";

/**
 * UsersBookshelf displays books and preferences for a specific user.
 *
 * State:
 * - finishedBooks: Array of books the user has finished reading.
 * - userPreferences: Object containing the user's favorite genre and book quote.
 * - currentlyReading: Array of books the user is currently reading.
 *
 * Behavior:
 * - Fetches and displays books the user is currently reading and has finished.
 * - Fetches and displays user preferences.
 * - Updates upon changes to the userId parameter.
 */

function UsersBookshelf() {
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    favoriteGenre: "",
    favoriteBookQuote: "",
  });
  const { userId } = useParams();
  const [currentlyReading, setCurrentlyReading] = useState([]);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const books = await fetchUsersFinishedBooks(userId);
        setFinishedBooks(books);

        const currentBooks = await fetchCurrentlyReadingForUser(userId);
        setCurrentlyReading(currentBooks);

        const preferences = await getUserPreferences(userId);
        setUserPreferences({
          favoriteGenre: preferences.favoriteGenre,
          favoriteBookQuote: preferences.favoriteBookQuote,
        });
      } catch (error) {
        console.error("Failed to load user details:", error);
      }
    };

    loadUserDetails();
  }, [userId]);

  return (
    <div>
      <h2>My Bookshelf</h2>
      {/* Display Currently Reading Books */}
      {currentlyReading.length > 0 && (
        <div>
          <h3>Currently Reading</h3>
          <ul>
            {currentlyReading.map((book) => (
              <li key={book.id}>
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  style={{ width: "100px", height: "150px" }}
                />
                {book.title} by {book.author}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Display User Preferences */}
      <div>
        <h3>Favorite Genre: {userPreferences.favoriteGenre}</h3>
        <p>
          Favorite Book Quote: &quot;{userPreferences.favoriteBookQuote}&quot;
        </p>
      </div>
      {finishedBooks.length > 0 ? (
        <ul>
          {finishedBooks.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author}
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven&apos;t finished any books yet.</p>
      )}
    </div>
  );
}

export default UsersBookshelf;
