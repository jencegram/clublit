const pool = require('../db');

/**
 * Class representing membership operations for users and clubs.
 */
class Membership {

  /**
 * Finds an existing membership by user ID and club ID.
 * This is used to check if a user is already a member of a specific club.
 * @param {number} userId - The ID of the user.
 * @param {number} clubId - The ID of the club.
 * @returns {object|null} The membership details if found, or null if no membership exists.
 */
  static async findByUserIdAndClubId(userId, clubId) {
    const query = `
      SELECT * FROM memberships
      WHERE userid = $1 AND clubid = $2;
    `;
    const values = [userId, clubId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  /**
   * Retrieves all memberships for a specific user.
   * This can be used to limit the number of clubs a user can join.
   * @param {number} userId - The ID of the user whose memberships are to be retrieved.
   * @returns {array} An array of all memberships associated with the user.
   */
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM memberships
      WHERE userid = $1;
    `;
    const values = [userId];
    const { rows } = await pool.query(query, values);
    return rows;
  }

  /**
   * Creates a new membership for a user with a specific club.
   * @param {object} membershipDetails - An object containing user ID, club ID, and join date.
   * @returns {object} The newly created membership record.
   */
  static async create({ userid, clubid, joindate }) {
    const query = `
    INSERT INTO memberships (userid, clubid, joindate)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
    const values = [userid, clubid, joindate];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  /**
   * Removes a membership, effectively allowing a user to leave a club.
   * @param {number} userId - The ID of the user.
   * @param {number} clubId - The ID of the club.
   * @returns {boolean} True if the deletion was successful, false otherwise.
   */
  static async remove(userId, clubId) {
    const query = `
    DELETE FROM memberships
    WHERE userid = $1 AND clubid = $2
    RETURNING *; 
  `;
    const { rows } = await pool.query(query, [userId, clubId]);
    return rows.length > 0;
  }

}

module.exports = Membership;


