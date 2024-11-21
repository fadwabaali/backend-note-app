const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

if (!process.env.ACCESS_TOKEN_SECRET) {
    const secret = crypto.randomBytes(64).toString('hex');
    
    // Save the new secret to the .env file for future use
    fs.appendFileSync('.env', `\nACCESS_TOKEN_SECRET=${secret}`);
    process.env.ACCESS_TOKEN_SECRET = secret;  // Load it into the environment
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
