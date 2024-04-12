const Forum = require('../models/Forum');

/**
 * Creates a new forum within a specific book club.
 * @param {object} req - The request object containing forum details (clubId, title, description, isAdminOnly).
 * @param {object} res - The response object to send back the newly created forum.
 */
exports.createForum = async (req, res) => {
  const { clubId, title, description, isAdminOnly } = req.body;
  
  try {
    // Create forum and save to database
    const newForum = await Forum.create({ clubId, title, description, isAdminOnly });
    // Respond with the created forum
    res.status(201).json(newForum);
  } catch (error) {
    console.error('Error creating forum:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Retrieves all forums associated with a specific book club.
 * @param {object} req - The request object containing clubId as URL parameter.
 * @param {object} res - The response object to send back the list of forums.
 */
exports.getForumsByClubId = async (req, res) => {
  const { clubId } = req.params;

  try {
    const forums = await Forum.findByClubId(clubId);
    res.status(200).json(forums);
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Retrieves detailed information about a specific forum.
 * @param {object} req - The request object containing forumId as URL parameter.
 * @param {object} res - The response object to send back the details of the forum.
 */
exports.getForumDetails = async (req, res) => {
  const { forumId } = req.params;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).send('Forum not found');
    }
    res.json(forum);
  } catch (error) {
    console.error('Error fetching forum details:', error);
    res.status(500).send('Server error');
  }
};
