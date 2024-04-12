const pool = require('../db');
const axios = require('axios');

/**
 * Represents a book with methods to manage book records in the database.
 */
class Book {
  /**
 * Adds a book to the list of currently reading for a user.
 * @param {number} userId - The user's ID.
 * @param {object} bookData - An object containing the book's title, author, and open library ID.
 * @returns {object} The newly added book.
 */
  static async addCurrentlyReading(userId, { title, author, openLibraryId }) {
    const { rows } = await pool.query(
      'INSERT INTO user_books (user_id, title, author, open_library_id, finished) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, author, openLibraryId, false]
    );
    return rows[0];
  }

  /**
  * Retrieves the list of books a user is currently reading.
  * @param {number} userId - The user's ID.
  * @returns {array} An array of books the user is currently reading.
  */
  static async getCurrentlyReading(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM user_books WHERE user_id = $1 AND finished = FALSE',
      [userId]
    );
    return rows;
  }

  /**
   * Marks a book as finished in the user's reading list.
   * @param {number} bookId - The ID of the book to mark as finished.
   * @returns {object} The updated book record.
   */
  static async markAsFinished(bookId) {
    const { rows } = await pool.query(
      'UPDATE user_books SET finished = TRUE WHERE id = $1 RETURNING *',
      [bookId]
    );
    return rows[0];
  }

  /**
   * Retrieves the list of books a user has finished reading.
   * @param {number} userId - The user's ID.
   * @returns {array} An array of books the user has finished reading.
   */
  static async getFinishedBooks(userId) {
    const query = 'SELECT * FROM user_books WHERE user_id = $1 AND finished = TRUE';
    const values = [userId];
    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (e) {
      console.error('Error querying finished books for user:', e);
      throw e;
    }
  }

  /**
   * Removes a book from the user's currently reading list.
   * @param {number} bookId - The ID of the book to remove.
   * @returns {object} The result of the delete operation.
   */
  static async removeCurrentlyReading(bookId) {
    try {
      const result = await pool.query(
        'DELETE FROM user_books WHERE id = $1 RETURNING *', [bookId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches the cover image of a book from the Google Books API based on the book's title.
   * @param {string} title - The title of the book.
   * @returns {string} URL of the book cover image.
   */
  static async fetchCoverImage(title) {
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
    try {
      const response = await axios.get(googleBooksUrl);
      const coverImage = response.data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || 'default_cover_image_url_here';
      return coverImage;
    } catch (error) {
      console.error("Failed to fetch cover image from Google Books:", error);
      return 'http://localhost:3000/images/notavailablebook.png';
    }
  }
}


module.exports = Book;