const pool = require('../db');

/**
 * Retrieves user preferences, including favorite genre and book quote.
 * This function queries the database for the user's favorite genre by ID and fetches the corresponding name.
 * If no preferences are set, default values are provided.
 * @param {object} req - The request object, containing either the user ID from params or authenticated user's ID.
 * @param {object} res - The response object to send back the user's preferences.
 */
exports.getUserPreferences = async (req, res) => {
    const userId = req.params.userId || req.user.userId;

    try {
        const genreIdResult = await pool.query(`
            SELECT favorite_genre 
            FROM users 
            WHERE userid = $1`, [userId]);

        const genreResult = genreIdResult.rows[0]?.favorite_genre
            ? await pool.query('SELECT genre_name FROM genres WHERE genre_id = $1', [genreIdResult.rows[0].favorite_genre])
            : { rows: [{ genre_name: 'No genre selected' }] };

        const quoteResult = await pool.query(`
            SELECT favorite_book_quote 
            FROM users 
            WHERE userid = $1`, [userId]);

        const userPreferences = {
            favoriteGenre: genreResult.rows[0].genre_name,
            favoriteBookQuote: quoteResult.rows[0]?.favorite_book_quote || 'No quote selected',
        };

        res.json(userPreferences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching preferences.' });
    }
};

/**
 * Updates user preferences, including favorite genre and book quote.
 * This function handles database transactions to ensure consistency during updates.
 * Responses indicate the success or failure of the update operation.
 * @param {object} req - The request object containing user's new preferences in the body.
 * @param {object} res - The response object to send back the status of the update operation.
 */
exports.updateUserPreferences = async (req, res) => {
    const userId = req.user.userId;
    const { favoriteGenre, favoriteBookQuote } = req.body;

    try {
        await pool.query('BEGIN');

        if (favoriteGenre !== undefined) {
            await pool.query('UPDATE users SET favorite_genre = $1 WHERE userid = $2', [favoriteGenre, userId]);
        }

        if (favoriteBookQuote !== undefined) {
            await pool.query('UPDATE users SET favorite_book_quote = $1 WHERE userid = $2', [favoriteBookQuote, userId]);
        }

        await pool.query('COMMIT');

        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, message: 'Preferences updated successfully.' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while updating preferences.' });
    }
};

