const pool = require('../db');

/**
 * Class to represent and handle operations for Book Clubs.
 */
class BookClub {
  /**
 * Creates a new book club and saves it to the database.
 * @param {object} details - The details of the book club including name, description, type, state, city, privacy setting, and admin user ID.
 * @returns {object} The newly created book club.
 */
  static async create({ clubName, description, clubType, state, city, clubPrivacy, adminUserID }) {
    const query = `
      INSERT INTO book_clubs
      (clubname, description, club_type, state, city, clubprivacy, adminuserid, createddate)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
    `;
    const values = [clubName, description, clubType, state, city, clubPrivacy, adminUserID];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  /**
   * Finds all book clubs that are public.
   * @returns {array} An array of all public book clubs.
   */
  static async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM book_clubs WHERE clubprivacy = TRUE'
    );
    return rows;
  }

  /**
   * Finds all book clubs managed by a specific admin user.
   * @param {number} adminUserID - The user ID of the admin.
   * @returns {array} An array of book clubs managed by the specified admin.
   */
  static async findByAdminUserId(adminUserID) {
    const { rows } = await pool.query(
      'SELECT * FROM book_clubs WHERE adminuserid = $1',
      [adminUserID]
    );
    return rows;
  }

  /**
   * Finds a book club by its ID.
   * @param {number} clubId - The ID of the book club.
   * @returns {object} The book club with the specified ID.
   */
  static async findById(clubId) {
    const { rows } = await pool.query(
      'SELECT * FROM book_clubs WHERE clubid = $1',
      [clubId]
    );
    return rows[0];
  }

  /**
   * Finds all book clubs in a specific state that are public.
   * @param {string} state - The state to search within.
   * @returns {array} An array of public book clubs in the specified state.
   */
  static async findByState(state) {
    const { rows } = await pool.query(
      "SELECT * FROM book_clubs WHERE state = $1 AND clubprivacy = TRUE",
      [state]
    );
    return rows;
  }

  /**
   * Finds all book clubs a user is associated with, either as an admin or a member.
   * @param {number} userId - The user's ID.
   * @returns {array} An array of book clubs the user is involved in.
   */
  static async findByUserId(userId) {
    const query = `
      SELECT bc.*, m.userid as member 
      FROM book_clubs bc 
      LEFT JOIN memberships m ON m.clubid = bc.clubid AND m.userid = $1 
      WHERE bc.adminuserid = $1 OR m.userid = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  /**
   * Updates the meeting information and announcements for a specific book club.
   * @param {number} clubId - The ID of the book club to update.
   * @param {object} updates - An object containing updates for meeting information and announcements.
   * @returns {object} The updated book club.
   */
  static async update(clubId, { meetinginfo, announcements }) {
    const query = `
    UPDATE book_clubs
    SET meetinginfo = COALESCE($2, meetinginfo),
        announcements = COALESCE($3, announcements)
    WHERE clubid = $1
    RETURNING *;
  `;
    const values = [clubId, meetinginfo, announcements];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

}

module.exports = BookClub;
