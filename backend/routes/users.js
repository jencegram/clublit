//backend/routes/users.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const BookController = require('../controllers/BookController');
const authenticateToken = require('../middleware/authenticateToken');

/**
 * POST /signup
 * Allows new users to register.
 * This route handles user creation including validation and storing user details securely.
 */
router.post('/signup', UserController.signup);

/**
 * POST /login
 * Authenticates a user and returns a JWT token for accessing protected routes.
 * This route verifies user credentials and issues a token upon successful authentication.
 */
router.post('/login', UserController.login);

/**
 * GET /:userId/finished
 * Retrieves all finished books for a specific user.
 */
router.get('/:userId/finished', authenticateToken, BookController.getUsersFinishedBooks);

/**
 * PUT /updatePassword
 * Allows authenticated users to update their password.
 * This route requires authentication and ensures that users can securely change their password.
 */
router.put('/updatePassword', authenticateToken, UserController.updatePassword);

module.exports = router;
