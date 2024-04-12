const pool = require('../db');

/**
 * Represents operations for creating and managing forums associated with book clubs.
 */

class Forum {

  /**
 * Creates a new forum and adds it to the database.
 * @param {object} details - The details of the forum including club ID, title, description, and admin-only status.
 * @returns {object} The newly created forum.
 */
  static async create({ clubId, title, description, isAdminOnly }) {

    const query = `
      INSERT INTO forums (clubid, title, description, isadminonly)
      VALUES ($1, $2, $3, $4)
      RETURNING *;  
    `;
    const values = [clubId, title, description, isAdminOnly];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  /**
 * Retrieves a forum by its ID.
 * @param {number} forumId - The ID of the forum to retrieve.
 * @returns {object} The forum if found, or undefined if not found.
 */
  static async findById(forumId) {
    const query = 'SELECT * FROM forums WHERE forumid = $1;';
    const { rows } = await pool.query(query, [forumId]);
    return rows[0];
  }

  /**
   * Retrieves all forums associated with a specific club ID.
   * @param {number} clubId - The club ID to find forums for.
   * @returns {array} An array of forums associated with the club ID.
   */
  static async findByClubId(clubId) {
    const query = 'SELECT * FROM forums WHERE clubid = $1;';
    const { rows } = await pool.query(query, [clubId]);
    return rows;
  }
}

module.exports = Forum;
