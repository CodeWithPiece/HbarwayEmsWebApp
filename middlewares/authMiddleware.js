const { verifyToken } = require('../helper/jwtHelper');
const userModel = require('../models/userModel');

const validateRequest = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        const { Id } = req.body;
        if (!token) {
            return res.status(400).json({ status: false, message: "Unauthorized: Token missing." });
        }
        const verifiedRequestToken = verifyToken(token);
        if (verifiedRequestToken) {
            const response = await userModel.validateToken(verifiedRequestToken.UserId);
            if (response.length === 0) {
                return res.status(400).json({ status: false, message: "Unauthorized: Invalid token." });
            } else {
                const dbUser = response[0];
                const verifiedDbToken = verifyToken(dbUser.UserToken);
                if (!verifiedDbToken) {
                    return res.status(400).json({ status: false, message: "Unauthorized: Invalid token." });
                } else if (verifiedDbToken.UserId != Id) {
                    return res.status(400).json({ status: false, message: "Unauthorized: Invalid token." });
                } else {
                    next();
                }
            }
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }

}

module.exports = validateRequest;