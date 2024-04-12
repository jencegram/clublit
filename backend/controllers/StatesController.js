// backend/controllers/StatesController.js

const State = require('../models/State');

/**
 * Retrieves all states from the database.
 * This function is typically used to populate dropdowns or for filtering purposes in the UI.
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the list of all states.
 */
exports.getAllStates = async (req, res) => {
  try {
    const states = await State.findAll();
    res.json(states);
  } catch (error) {
    console.error('Failed to fetch states:', error);
    res.status(500).send('Server error');
  }
};
