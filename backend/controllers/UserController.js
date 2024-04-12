const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Function to generate JWT tokens
const generateToken = (userId, username) => {
  return jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

/**
 * Registers a new user with encrypted password and generates a JWT token.
 * Checks for existing username or email to prevent duplicates.
 * @param {object} req - The request object containing the user's signup information.
 * @param {object} res - The response object used to send back the user token and details.
 */
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUsername = await User.findByUsername(username);
    const existingEmail = await User.findByEmail(email);

    if (existingUsername || existingEmail) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profileprivacy: true,
    });

    const token = generateToken(newUser.userid, newUser.username);
    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Authenticates a user, checks password, and returns a JWT token if successful.
 * @param {object} req - The request object containing login credentials.
 * @param {object} res - The response object to send back the user token and username.
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user.userid, user.username);

    res.json({
      message: 'Login successful',
      token,
      username: user.username,
      userId: user.userid, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

/**
 * Updates the user's password after verifying the old password.
 * @param {object} req - The request object containing the old and new passwords.
 * @param {object} res - The response object to send back the status of the update.
 */
exports.updatePassword = async (req, res) => {
  const userId = req.user.userId; 
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await pool.query('SELECT password FROM users WHERE userid = $1', [userId]);
    const passwordIsValid = await bcrypt.compare(oldPassword, user.rows[0].password);

    if (!passwordIsValid) {
      return res.status(403).json({ message: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password = $1 WHERE userid = $2', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
};