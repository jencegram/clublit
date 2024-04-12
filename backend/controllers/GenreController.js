// backend/controllers/GenreController.js
const pool = require('../db');

/**
 * Retrieves all genres from the database and sorts them alphabetically by name.
 * This function is used to provide a list of all possible book genres for selection or filtering purposes.
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the list of genres.
 */
exports.getGenres = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM genres ORDER BY genre_name');
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    res.status(500).send('Server error');
  }
};

