const pool = require('../db');

/**
 * Class to represent and handle operations for posts within forums.
 */
class Post {
  /**
   * Creates a new post in a specified forum with the current timestamp.
   * @param {object} postData - The details of the post including club ID, forum ID, author's user ID, and content.
   * @returns {object} The newly created post.
   */
  static async create({ clubId, forumId, authorUserId, content }) {
    const query = `
      INSERT INTO posts (clubid, forumid, authoruserid, content, postdate)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const values = [clubId, forumId, authorUserId, content];
    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (e) {
      console.error("Error creating a new post in the database: ", e);
      throw e;
    }
  }

  /**
   * Retrieves all posts for a specific forum and orders them by their creation date in descending order.
   * This method also joins the user table to include the username of the post's author.
   * @param {number} forumId - The ID of the forum for which to retrieve posts.
   * @returns {array} An array of posts, each including post details and the author's username.
   */
  static async findByForumId(forumId) {
    const query = `
      SELECT p.*, u.username,
             TO_CHAR(p.postdate, 'YYYY-MM-DD HH24:MI:SS') as formatted_date
      FROM posts p
      JOIN users u ON p.authoruserid = u.userid
      WHERE p.forumid = $1
      ORDER BY p.postdate DESC;
    `;
    try {
      const { rows } = await pool.query(query, [forumId]);
      return rows;
    } catch (e) {
      console.error("Error fetching posts from the database: ", e);
      throw e;
    }
  }
}

module.exports = Post;
