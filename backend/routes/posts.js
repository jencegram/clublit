const express = require('express');
const PostController = require('../controllers/PostController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

/**
 * POST /
 * Creates a new post within a forum.
 * Requires authentication to ensure that only logged-in users can create posts.
 */
router.post('/', authenticateToken, PostController.createPost);

/**
 * GET /forum/:forumId
 * Retrieves all posts within a specific forum identified by forumId.
 * Requires authentication to ensure that access is limited to users who have permissions to view the forum.
 */
router.get('/forum/:forumId', authenticateToken, PostController.getPostsByForumId);

module.exports = router;
