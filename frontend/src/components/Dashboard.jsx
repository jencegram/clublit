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
import styles from "../styles/Dashboard.module.css";

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


  // Load data on component mount
  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    loadUserBookClubs();
    loadCurrentlyReading();
  }, []);

  // Add a book to the currently reading list
  const handleAddBook = async (book) => {
    try {
      const bookData = {
        title: book.title,
        author: book.author_name[0],
        openLibraryId: book.key,
      };
      await addBookToCurrentlyReading(bookData);
      await loadCurrentlyReading();
      setShowSearchResults(false);
    } catch (error) {
      console.error("Error adding book to currently reading:", error);
    }
  };


  // Mark a book as finished
  const handleFinishBook = async (bookId) => {
    try {
      await markBookAsFinished(bookId);
      await loadCurrentlyReading();
    } catch (error) {
      console.error(error.message);
    }
  };

  // Remove a book from the currently reading list
  const handleRemoveBook = async (bookId) => {
    try {
      await fetch(`${API_URL}/currently-reading/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      loadCurrentlyReading();
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  return (
    <div>
      <h1 className="sectionTitle">Dashboard</h1>
      <p className="welcomeMessage">Welcome, {username}</p>
      <section>
        <h2 className="sectionTitle">My Book Clubs</h2>
        <div className={styles.bookClubsList}>
          {userBookClubs.map((club) => (
            <div key={club.clubid} className={styles.bookClubCard}>
              <h4 className={styles.bookClubName}>
                <Link to={`/bookclubs/${club.clubid}`}>{club.clubname}</Link>
              </h4>
              <p>
                <strong>Meeting Info:</strong>
                <br />
                {club.meetinginfo}
              </p>
              <p>
                <strong>Announcements:</strong>
                <br />
                {club.announcements}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="sectionTitle">Book Search</h2>
        <BookSearch
          onAdd={handleAddBook}
          showResults={showSearchResults}
          setShowResults={setShowSearchResults}
        />
      </section>
      <section>
        <h2 className="sectionTitle">Currently Reading</h2>
        <div className={styles.currentlyReadingList}>
          {currentlyReading.map((book) => (
            <div key={book.id} className={styles.currentlyReadingCard}>
              <img
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                className={styles.bookCover}
              />
              <div>
                <h4>{book.title}</h4>
                <p>by {book.author}</p>
                <button
                  onClick={() => handleRemoveBook(book.id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
                <div className={styles.finishedCheckbox}>
                  <label>
                    Finished?
                    <input
                      type="checkbox"
                      onChange={() => handleFinishBook(book.id)}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
