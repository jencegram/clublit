const pool = require('../db');

/**
 * Class to represent and handle operations related to states.
 */
class State {
    /**
     * Retrieves all states from the database, ordered alphabetically by their name.
     * This method is typically used to populate dropdown lists or for filtering purposes.
     * @returns {array} An array of state objects, each containing state details.
     */
    static async findAll() {
        const { rows } = await pool.query('SELECT * FROM states ORDER BY name');
        return rows;
    }
}

module.exports = State;
