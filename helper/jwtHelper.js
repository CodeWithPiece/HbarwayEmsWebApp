const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET

const generateToken = (data) => {
    return jwt.sign({ UserId: data.UserId, UserName: data.UserName, RoleId: data.RoleId }, SECRET_KEY, { expiresIn: '7d' })
}

const verifyToken = (data) => {
    return jwt.verify(data, SECRET_KEY);
}

module.exports = {
    generateToken,
    verifyToken
};