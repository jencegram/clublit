// backend/routes/forums.js

const express = require('express');
const ForumController = require('../controllers/ForumController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();


/**
 * GET /club/:clubId
 * Retrieves all forums associated with a specific club ID.
 */
router.get('/club/:clubId', authenticateToken, ForumController.getForumsByClubId);

/**
 * GET /details/:forumId
 * Retrieves detailed information about a specific forum identified by its forum ID.
 * This includes posts, activities, and permissions specific to the forum.
 */
router.get('/details/:forumId', authenticateToken, ForumController.getForumDetails);

/**
 * POST /
 * Creates a new forum within a club. The details required include club ID, forum title, description, and admin-only status.
 */
router.post('/', authenticateToken, ForumController.createForum);

module.exports = router;

