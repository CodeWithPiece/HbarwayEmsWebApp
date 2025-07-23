const bcrypt = require('bcrypt');

const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plainPassword, saltRounds);
    return hashed;
}

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    hashPassword,
    verifyPassword
};