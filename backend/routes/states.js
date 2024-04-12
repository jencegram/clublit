const express = require('express');
const State = require('../models/State'); 
const router = express.Router();

/**
 * GET /
 * Retrieves all states from the database.
 */
router.get('/', async (req, res) => {
    try {
        const states = await State.findAll();
        res.json(states);
    } catch (error) {
        console.error('Failed to fetch states:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
