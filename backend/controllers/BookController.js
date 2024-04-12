const Book = require('../models/Book');

/**
 * Adds a book to the list of currently reading for a user.
 * @param {object} req - The request object containing user and book details.
 * @param {object} res - The response object to send back the added book.
 */
exports.addCurrentlyReading = async (req, res) => {
  try {
    const userId = req.user.userId;
    const book = await Book.addCurrentlyReading(userId, req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

/**
 * Marks a book as finished for a user.
 * @param {object} req - The request object containing book ID in params.
 * @param {object} res - The response object to send back the finished book details.
 */
exports.markAsFinished = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const finishedBook = await Book.markAsFinished(bookId);
    res.json(finishedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

/**
 * Retrieves the list of books that a user is currently reading.
 * Also fetches cover images for each book.
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object to send back books with cover images.
 */
exports.getCurrentlyReading = async (req, res) => {
  try {
    const userId = req.user.userId;
    const books = await Book.getCurrentlyReading(userId);

    // Fetch cover images for each book
    const booksWithCovers = await Promise.all(books.map(async (book) => {
      const coverImage = await Book.fetchCoverImage(book.title);
      return { ...book, coverImage };
    }));

    res.json(booksWithCovers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

/**
 * Retrieves the list of books a user has finished reading.
 * Returns an error if no books are found.
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object to send back the list of finished books.
 */
exports.getFinishedBooks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const books = await Book.getFinishedBooks(userId);
    if (books.length === 0) {
      return res.status(404).json({ message: "No finished books found for this user." });
    }
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

/**
 * Removes a book from the currently reading list of a user.
 * @param {object} req - The request object containing book ID in params.
 * @param {object} res - The response object to send back confirmation of removal.
 */
exports.removeCurrentlyReading = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const result = await Book.removeCurrentlyReading(bookId);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book removed successfully', book: result.rows[0] });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

/**
 * Updates information about a book club.
 * @param {object} req - The request object containing club ID and update details in body.
 * @param {object} res - The response object to send back the updated book club details.
 */
exports.updateClubInfo = async (req, res) => {
  const { clubId } = req.params;
  const updates = req.body;

  try {
    const updatedClub = await BookClub.update(clubId, updates);

    if (!updatedClub) {
      return res.status(404).json({ message: 'Book club not found or unable to update.' });
    }

    res.json(updatedClub);
  } catch (error) {
    console.error('Error updating book club info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Fetches all finished books of a specified user by their ID.
 * @param {object} req - The request object containing user ID in params.
 * @param {object} res - The response object to send back the list of finished books.
 */
exports.getUsersFinishedBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const books = await Book.getFinishedBooks(userId); 

    if (books.length === 0) {
      return res.status(404).json({ message: "No finished books found for this user." });
    }
    res.json(books);
  } catch (error) {
    console.error("Error fetching user's finished books:", error);
    res.status(500).send('Server error');
  }
};

/**
 * Retrieves the currently reading list for a specified user by their ID.
 * Includes fetching cover images for each book.
 * @param {object} req - The request object containing user ID in params.
 * @param {object} res - The response object to send back the books with cover images.
 */
exports.getCurrentlyReadingForUser = async (req, res) => {
  try {
    const { userId } = req.params; 
    const books = await Book.getCurrentlyReading(userId);

    const booksWithCovers = await Promise.all(books.map(async (book) => {
      const coverImage = await Book.fetchCoverImage(book.title);
      return { ...book, coverImage };
    }));

    res.json(booksWithCovers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};