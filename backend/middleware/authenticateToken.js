// backend/middleware/authenticateToken.js

const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate tokens on protected routes.
 * This function checks if the token is present and valid before allowing access to protected routes.
 * It reads the token from the 'Authorization' header, verifies it, and if valid, attaches the decoded user to the request object.
 * @param {object} req - The request object from the client. Contains headers with the token.
 * @param {object} res - The response object used to send back the HTTP status if authentication fails.
 * @param {function} next - The next middleware function in the stack.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;

