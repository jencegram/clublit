const express = require('express');
const BookClubController = require('../controllers/BookClubController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

/**
 * POST /bookclubs
 * Route to handle creating a new book club.
 */
router.post('/bookclubs', authenticateToken, BookClubController.createBookClub);

/**
 * GET /bookclubs
 * Route to get all book clubs.
 */
router.get('/bookclubs', BookClubController.getAllBookClubs);

/**
 * GET /bookclubs/:clubId
 * Route to get details for a specific book club.
 * Requires authentication to ensure user can only access details for clubs they are associated with.
 */
router.get('/bookclubs/:clubId', authenticateToken, BookClubController.getBookClubDetails);

/**
 * GET /bookclubs/state/:stateName
 * Route to get book clubs filtered by state.
 */
router.get('/bookclubs/state/:stateName', BookClubController.getBookClubsByState);

/**
 * GET /user/bookclubs
 * Route to get book clubs the authenticated user has joined or created.
 */
router.get('/user/bookclubs', authenticateToken, BookClubController.getUserBookClubs);

/**
 * POST /bookclubs/join
 * Route to handle a user joining a book club.
 */
router.post('/bookclubs/join', authenticateToken, BookClubController.joinBookClub);

/**
 * GET /bookclubs/:clubId/check-membership
 * Route to check if a user is a member of a specific book club.
 */
router.get('/bookclubs/:clubId/check-membership', authenticateToken, BookClubController.checkMembership);

/**
 * DELETE /bookclubs/:clubId/leave
 * Route to handle a user leaving a book club.
 */
router.delete('/bookclubs/:clubId/leave', authenticateToken, BookClubController.leaveBookClub);

/**
 * PUT /bookclubs/:clubId/update
 * Route to handle updating book club information.
 */
router.put('/bookclubs/:clubId/update', authenticateToken, BookClubController.updateClubInfo);


module.exports = router;