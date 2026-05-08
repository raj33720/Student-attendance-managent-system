const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const Auth = (allowedRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7).trim()
            : null;

        if (!token) {
            return res.status(401).json({ msg: 'Authentication token is missing.' });
        }

        try {
            const payload = jwt.verify(token, secretKey);

            if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
                return res.status(403).json({ msg: 'You are not authorized to access this resource.' });
            }

            req.user = payload;
            next();
        } catch (error) {
            return res.status(401).json({ msg: 'Invalid or expired token.' });
        }
    }
};

module.exports = Auth;
