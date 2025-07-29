const { verifyPassword } = require('../helper/password');
const { generateToken } = require('../helper/jwtHelper');
const userModel = require('../models/userModel');

exports.userLogin = async (req, res) => {
    try {
        const { UserMobileNo, UserPassword } = req.body;
        const response = await userModel.userLogin(UserMobileNo);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "User not found." });
        } else {
            const dbUser = response[0];
            const passwordMatch = await verifyPassword(UserPassword, dbUser.UserPassword);
            if (!passwordMatch) {
                return res.status(400).json({ status: false, message: "Invalid login credentials." });
            } else {
                const UserToken = generateToken({ UserId: dbUser.UserId, UserName: dbUser.UserName, RoleId: dbUser.RoleId })
                const saveResponse = await userModel.saveToken({ UserId: dbUser.UserId, UserToken });
                if (saveResponse.rowsAffected && saveResponse.rowsAffected[0] === 1) {
                    const userDetails = response[0];
                    const filteredUser = {
                        UserId: userDetails.UserId,
                        UserName: userDetails.UserName,
                        UserMobileNo: userDetails.UserMobileNo,
                        UserEmailAddress: userDetails.UserEmailAddress,
                        UserAddress: userDetails.UserAddress,
                        RoleId: userDetails.RoleId,
                        IsActive: userDetails.IsActive,
                        UserToken
                    };
                    res.cookie('token', UserToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'Strict',
                        maxAge: 3600 * 1000
                    });
                    return res.status(200).json({ status: true, message: "Login successfully.", data: filteredUser });
                } else {
                    return res.status(500).json({ status: false, message: "Internal server error." });
                }
            }
        }
    } catch (err) {
        res.status(400).json({ status: false, message: `Internal server error: ${err.message}` });
    }

}

exports.userRegister = async (req, res) => {
    try {
        const response = await userModel.userRegister(req.body);
        if (response.rowsAffected && response.rowsAffected[0] === 1) {
            return res.status(200).json({ status: true, message: "User created successfully." });
        } else {
            return res.status(400).json({ status: false, message: "User creation failed, please check all fields." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }

}

exports.userUpdate = async (req, res) => {
    try {
        const response = await userModel.userUpdate(req.body);
        if (response.rowsAffected && response.rowsAffected[0] === 1) {
            return res.status(200).json({ status: true, message: "User update successfully." });
        } else {
            return res.status(400).json({ status: false, message: "User updation failed, please check all fields." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }

}

exports.checkInAndOut = async (req, res) => {
    try {
        const response = await userModel.checkInAndOut(req.body);
        const dbLog = response[0].CheckId;
        console.log(dbLog);
        if (dbLog == 0) {
            return res.status(200).json({ status: true, message: "Attendance already marked for today.", });
        } else if (dbLog == 1) {
            return res.status(200).json({ status: true, message: "Your attendance has been recorded." });
        }
        else {
            return res.status(400).json({ status: false, message: "Attendance marked failed." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }

}

exports.getTotalUserCount = async (req, res) => {
    try {
        const response = await userModel.getTotalUserCount();
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Details not found." });
        } else {
            const dbUser = response[0];
            return res.status(200).json({ status: true, message: "Details fetched successfully.", data: dbUser });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const response = await userModel.getUsers(req.body);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Users not found." });
        } else {
            return res.status(200).json({ status: true, message: "Users details fetched successfully.", data: response });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }
}

exports.getUsersAttendace = async (req, res) => {
    try {
        const response = await userModel.getUsersAttendace(req.body);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Users attendance not found." });
        } else {
            return res.status(200).json({ status: true, message: "Users attendance fetched successfully.", data: response });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }
}

exports.getUserStatus = async (req, res) => {
    try {
        const response = await userModel.getUserStatus(req.body);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "User status not found." });
        } else {
            const dbUser = response[0];
            return res.status(200).json({ status: true, message: "User status fetched successfully.", data: dbUser });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }

}

exports.userLogout = async (req, res) => {
    try {
        const saveResponse = await userModel.userLogout(req.body);
        if (saveResponse.rowsAffected && saveResponse.rowsAffected[0] === 1) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: false,
                sameSite: 'Strict'
            });
            res.status(200).json({ status: true, message: "Logout successfully." });
        } else {
            return res.status(400).json({ status: false, message: "Invalid credentials." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }

}