const express = require('express');
const GenreController = require('../controllers/GenreController');
const router = express.Router();

/**
 * GET /
 * Retrieves all book genres from the database.
 */
router.get('/', GenreController.getGenres);

module.exports = router;
