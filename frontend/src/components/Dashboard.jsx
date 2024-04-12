import React from "react";
import { useState, useEffect } from "react";
import {
  fetchCurrentlyReading,
  addBookToCurrentlyReading,
  markBookAsFinished,
} from "../api/bookApi";
import { fetchMyBookClubs } from "../api/bookClubApi";
import BookSearch from "./BookSearch";
import { Link } from "react-router-dom";

/**
 * Dashboard serves as the main user interface for displaying a user's book clubs,
 * currently reading books, and allows searching and managing books.
 *
 * State:
 * - username: Stores the username retrieved from local storage.
 * - userBookClubs: Stores an array of book clubs the user is part of.
 * - currentlyReading: List of books the user is currently reading.
 * - showSearchResults: Controls the visibility of the search results.
 *
 * Behavior:
 * - On component mount, loads user's book clubs and currently reading books.
 * - Handles adding and marking books as finished, updating the currently reading list accordingly.
 * - Provides links to detailed views of each book club and functionality to manage reading status.
 */

const API_URL = "http://localhost:5000/api";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [userBookClubs, setUserBookClubs] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(true);

  const loadUserBookClubs = async () => {
    try {
      const clubs = await fetchMyBookClubs();
      setUserBookClubs(clubs);
    } catch (error) {
      console.error("Error fetching user's book clubs: ", error.message);
    }
  };

  const loadCurrentlyReading = async () => {
    try {
      const books = await fetchCurrentlyReading();
      setCurrentlyReading(books.slice(0, 3));
    } catch (error) {
      console.error("Error fetching currently reading books: ", error.message);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    loadUserBookClubs();
    loadCurrentlyReading();
  }, []);

  const handleAddBook = async (book) => {
    try {
      await addBookToCurrentlyReading({
        title: book.title,
        author: book.author_name[0],
        openLibraryId: book.key,
      });
      await loadCurrentlyReading();
      setShowSearchResults(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFinishBook = async (bookId) => {
    try {
      await markBookAsFinished(bookId);
      await loadCurrentlyReading();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/currently-reading/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCurrentlyReading(
          currentlyReading.filter((book) => book.id !== bookId)
        );
      } else {
        console.error("Failed to remove book");
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {username}</p>
      <section>
        <h3>My Book Clubs</h3>
        <div className="book-clubs-list">
          {userBookClubs.map((club) => (
            <div key={club.clubid} className="book-club">
              <h4>
                <Link to={`/bookclubs/${club.clubid}`}>{club.clubname}</Link>
              </h4>
              <p>Description: {club.description}</p>
              <p>Meeting Info: {club.meetinginfo}</p>
              <p>Announcements: {club.announcements}</p>
            </div>
          ))}
        </div>
      </section>
      <BookSearch
        onAdd={handleAddBook}
        showResults={showSearchResults}
        setShowResults={setShowSearchResults}
      />
      <section>
        <h3>Currently Reading</h3>
        <ul>
          {currentlyReading.map((book) => (
            <li key={book.id}>
              <img
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                style={{ marginRight: "10px" }}
              />
              {book.title} by {book.author}
              <button onClick={() => handleRemoveBook(book.id)}>Remove</button>
              <label>
                Finished?{" "}
                <input
                  type="checkbox"
                  onChange={() => handleFinishBook(book.id)}
                />
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
