const express = require('express');
const profileController = require('../controllers/ProfileController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

/**
 * GET /preferences
 * Retrieves the preferences for the authenticated user.
 * This includes settings like favorite genre and book quotes.
 * Requires authentication to ensure that preferences are only accessed by the user themselves.
 */
router.get('/preferences', authenticateToken, profileController.getUserPreferences);

/**
 * GET /preferences/:userId
 * Retrieves the preferences for a specific user identified by userId.
 */
router.get('/preferences/:userId', authenticateToken, profileController.getUserPreferences);

/**
 * PUT /preferences
 * Updates the preferences for the authenticated user.
 * Users can modify settings such as their favorite genre or book quote.
 * Requires authentication to ensure that users can only modify their own preferences.
 */
router.put('/preferences', authenticateToken, profileController.updateUserPreferences);

module.exports = router;
