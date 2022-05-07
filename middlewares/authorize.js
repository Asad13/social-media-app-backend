const jwt = require('jsonwebtoken');

const authorize = async (req, res, next) => {
    let token = req.header('Authorization'); // Getting the token from the header
    if (!token) return res.status(401).send('Access denied,Token not found.'); // If there is no token don't authenticate

    token = token.split(' ')[1].trim(); // Splitting the token value and then removing the initial Bearer string to get the original token
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // verifying the token
        req.user = decoded; // if verified saving the user data to the req object for future use
        next(); // As the user is authorized passing to the next middleware
    } catch (error) {
        // If the token sent is invalid somehow then don't authenticate
        return res.status(400).send('Access denied,Invalid Token.');
    }
}

module.exports = authorize; // exporting the authorize function