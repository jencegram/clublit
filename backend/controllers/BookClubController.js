const Forum = require('../models/Forum');
const BookClub = require('../models/BookClub');
const Membership = require('../models/Membership');

// Function to retrieve all book clubs from the database
/**
 * Retrieves all book clubs from the database and returns them.
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the book clubs.
 */
exports.createBookClub = async (req, res) => {
  try {
    const adminUserID = req.user.userId;
    const { clubName, description, clubType, state, city } = req.body;

    if (clubType === "In-Person" && (!state || !city)) {
      return res.status(400).send('State and city are required for in-person clubs.');
    }

    // Create new book club with provided details
    const newClub = await BookClub.create({
      clubName,
      description,
      clubType,
      state,
      city,
      clubPrivacy: true,
      adminUserID,
    });

    // Add creator as a member of the club
    await Membership.create({
      userid: adminUserID,
      clubid: newClub.clubid,
      joindate: new Date(),
    });

    // Predefined forum topics for a new book club
    const defaultForums = [
      { title: 'Member Introductions', description: 'Introduce yourself to fellow book lovers.' },
      { title: 'Events and Meet Ups', description: 'Stay updated on upcoming book club events.' },
      { title: 'Book Discussions', description: 'Dive into detailed discussions about our current reads, and past selections.' },
      { title: 'Book Club Operations', description: 'Participate in the behind-the-scenes decision-making process. Vote on book selections, meeting times, and discuss how our club runs.' },
      { title: 'Book Recommendations', description: 'Looking for your next great read? Get and give recommendations on what to dive into next.' },
      { title: 'Author Discussions', description: 'A place to discuss specific authors, their works, and their impact on literature. Join to celebrate your favorite authors and discover new ones.' },
      { title: 'General Chat', description: 'For all off-topic conversations, non-book-related hobbies, and to get to know your fellow club members beyond the books.' }
    ];

    // Create default forums for the new book club
    for (const forum of defaultForums) {
      await Forum.create({
        clubId: newClub.clubid,
        title: forum.title,
        description: forum.description,
        isAdminOnly: false,
      });
    }

    res.status(201).json(newClub);

  } catch (error) {
    console.error('Error creating book club:', error);
    res.status(500).send('Server error');
  }
};


// Function to retrieve all book clubs from the database
/**
 * Retrieves all book clubs from the database and returns them.
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the book clubs.
 */
exports.getAllBookClubs = async (req, res) => {
  try {
    const bookClubs = await BookClub.findAll();
    res.json(bookClubs);
  } catch (error) {
    console.error('Failed to fetch book clubs:', error);
    res.status(500).send('Server error');
  }
};

// Function to retrieve details for a specific book club based on user membership
/**
 * Retrieves details of a specific book club.
 * Returns full details if the user is a member, otherwise limited information.
 * @param {object} req - The request object containing user and params.
 * @param {object} res - The response object to send back book club details.
 */
exports.getBookClubDetails = async (req, res) => {
  try {
    // Extract club ID from URL parameters and user ID from request
    const { clubId } = req.params;
    const userId = req.user.userId; // Get user id from token

    // Fetch book club details from database
    const clubDetails = await BookClub.findById(clubId);
    if (!clubDetails) {
      return res.status(404).send('Book club not found');
    }

    // Check if user is a member of the club
    const membership = await Membership.findByUserIdAndClubId(userId, clubId);
    const isMember = !!membership;

    // Limit details if not a member
    const response = isMember ? clubDetails : {
      clubname: clubDetails.clubname,
      description: clubDetails.description
    };

    res.json({ ...response, isMember });
  } catch (error) {
    console.error('Failed to fetch book club details:', error);
    res.status(500).send('Server error');
  }
};

// Function to fetch the book clubs that the current user is a member of
/**
 * Retrieves book clubs that the current user is a member of.
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object to send back user's book clubs.
 */
exports.getMyBookClubs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookClubs = await BookClub.findByUserId(userId);
    res.json(bookClubs);
  } catch (error) {
    console.error('Error fetching user\'s book clubs:', error);
    res.status(500).send('Server error');
  }
};

// Function to retrieve all book clubs in a specific state
/**
 * Retrieves book clubs located in a specified state.
 * @param {object} req - The request object containing state name in params.
 * @param {object} res - The response object to send back book clubs by state.
 */
exports.getBookClubsByState = async (req, res) => {
  try {
    const { stateName } = req.params;
    const bookClubs = await BookClub.findByState(stateName);
    res.json(bookClubs);
  } catch (error) {
    console.error(`Failed to fetch book clubs for state ${stateName}:`, error);
    res.status(500).send('Server error');
  }
};

// Function to retrieve book clubs that a specific user is a member of
/**
 * Retrieves book clubs that a specific user is a member of.
 * @param {object} req - The request object containing user information.
 * @param {object} res - The response object to send back the user's book clubs.
 */
exports.getUserBookClubs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookClubs = await BookClub.findByUserId(userId);
    res.json(bookClubs);
  } catch (error) {
    console.error('Error fetching book clubs for user:', error);
    res.status(500).send('Server error');
  }
};

// Function to update club information, accessible only by the club admin
/**
 * Updates the information of a specific book club.
 * Ensures only the club admin can make updates.
 * @param {object} req - The request object containing club ID and update details.
 * @param {object} res - The response object to send back the updated club information.
 */
exports.updateClubInfo = async (req, res) => {
  const { clubId } = req.params;
  const { meetinginfo, announcements } = req.body;

  try {
    const club = await BookClub.findById(clubId);
    if (!club) {
      return res.status(404).send('Book club not found');
    }

    if (club.adminuserid !== req.user.userId) {
      return res.status(403).send('Unauthorized: Only the admin can update this info.');
    }

    const updatedClub = await BookClub.update(clubId, { meetinginfo, announcements });
    res.status(200).json(updatedClub);
  } catch (error) {
    console.error('Error updating book club info:', error);
    res.status(500).send('Server error');
  }
};

// Function to allow a user to join a book club with restrictions on the number of clubs joined
/**
 * Allows a user to join a book club, enforcing a limit on the number of clubs a user can join.
 * Prevents joining the same club multiple times.
 * @param {object} req - The request object containing user info and club ID.
 * @param {object} res - The response object to send back the new membership details.
 */
exports.joinBookClub = async (req, res) => {
  const userId = req.user.userId;
  const { clubId } = req.body;

  try {
    // Check current memberships and enforce limit
    const userMemberships = await Membership.findByUserId(userId);
    if (userMemberships.length >= 3) {
      return res.status(400).send('Cannot join more than 3 book clubs.');
    }
    // Prevent the user from joining the same club multiple times
    const existingMembership = await Membership.findByUserIdAndClubId(userId, clubId);
    if (existingMembership) {
      return res.status(409).send('User is already a member of this book club.');
    }

    // Create a new membership for the user
    const newMembership = await Membership.create({
      userid: userId,
      clubid: clubId,
      joindate: new Date(),
    });

    res.status(201).json(newMembership);
  } catch (error) {
    console.error('Error joining book club:', error);
    res.status(500).send('Server error');
  }
};

// Function to check if a user is a member of a specified book club
/**
 * Checks if the user is a member of a specified book club.
 * @param {object} req - The request object containing user ID and club ID.
 * @param {object} res - The response object to send back membership status.
 */
exports.checkMembership = async (req, res) => {
  const userId = req.user.userId;
  const { clubId } = req.params;

  try {
    const membership = await Membership.findByUserIdAndClubId(userId, clubId);
    res.json({ isMember: !!membership });
  } catch (error) {
    console.error('Error checking membership:', error);
    res.status(500).send('Server error');
  }
};

// Function to allow a user to leave a book club by removing their membership
/**
 * Allows a user to leave a book club by removing their membership.
 * @param {object} req - The request object containing user ID and club ID.
 * @param {object} res - The response object to confirm the membership has been removed.
 */
exports.leaveBookClub = async (req, res) => {
  const userId = req.user.userId;
  const { clubId } = req.params; parameter

  try {
    const result = await Membership.remove(userId, clubId);
    if (result) {
      res.status(200).json({ message: "Successfully left the book club." });
    } else {
      res.status(404).send("Membership not found.");
    }
  } catch (error) {
    console.error('Error leaving book club:', error);
    res.status(500).send('Server error');
  }
};
