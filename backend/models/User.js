const pool = require('../db');

/**
 * Class to handle database operations related to user management.
 */
class User {
  /**
   * Retrieves a user from the database by their username.
   * This method is often used for login processes or username validation.
   * @param {string} username - The username to search for in the database.
   * @returns {object|null} The user object if found, otherwise null.
   */
  static async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  /**
   * Retrieves a user from the database by their email address.
   * This method is typically used for verification processes, such as during signup or forgot password.
   * @param {string} email - The email address to search for in the database.
   * @returns {object|null} The user object if found, otherwise null.
   */
  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  /**
   * Creates a new user in the database.
   * This method is used during the user registration process.
   * @param {object} userData - An object containing username, email, password, and profile privacy settings.
   * @returns {object} The newly created user object.
   */
  static async create({ username, email, password, profileprivacy = true }) {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password, profileprivacy) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, password, profileprivacy]
    );
    return rows[0];
  }
}

module.exports = User;
