const express = require('express');
const BookController = require('../controllers/BookController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

/**
 * POST /currently-reading
 * Route to add a book to the currently reading list of the authenticated user.
 */
router.post('/currently-reading', authenticateToken, BookController.addCurrentlyReading);

/**
 * PATCH /currently-reading/:bookId/finish
 * Route to mark a book as finished in the currently reading list of the authenticated user.
 */
router.patch('/currently-reading/:bookId/finish', authenticateToken, BookController.markAsFinished);

/**
 * GET /currently-reading
 * Route to retrieve all books that the authenticated user is currently reading.
 */
router.get('/currently-reading', authenticateToken, BookController.getCurrentlyReading);

/**
 * GET /finished
 * Route to retrieve all books that the authenticated user has finished reading.
 */
router.get('/finished', authenticateToken, BookController.getFinishedBooks);

/**
 * DELETE /currently-reading/:bookId
 * Route to remove a book from the currently reading list of the authenticated user.
 */
router.delete('/currently-reading/:bookId', authenticateToken, BookController.removeCurrentlyReading);

/**
 * GET /users/:userId/currently-reading
 * Route to fetch the currently reading list for a specific user by user ID.
 */
router.get('/users/:userId/currently-reading', authenticateToken, BookController.getCurrentlyReadingForUser);

module.exports = router;
