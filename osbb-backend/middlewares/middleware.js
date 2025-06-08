const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(allowedRoles = []) {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, config.jwtSecret);

            req.user = decoded.user;
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.user.role)) {
                return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
            }

            next();
        } catch (err) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
    };
}

module.exports = verifyToken;
