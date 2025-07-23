const { sql, poolPromise } = require('../config/db');
const { hashPassword } = require('../helper/password');

const userModel = function (model) {
    this.UserId = model.UserId;
    this.UserName = model.UserName;
    this.UserMobileNo = model.UserMobileNo;
    this.UserEmailAddress = model.UserEmailAddress;
    this.UserAddress = model.UserAddress;
    this.UserRole = model.UserRole;
    this.UserPassword = model.UserPassword;
    this.UserToken = model.UserToken;
    this.Id = model.Id;
    this.InLocation = model.InLocation;
    this.OutLocation = model.OutLocation;
    this.InLatitude = model.InLatitude;
    this.InLongitude = model.InLongitude;
    this.OutLatitude = model.OutLatitude;
    this.OutLongitude = model.OutLongitude;
    this.InTime = model.InTime;
    this.OutTime = model.OutTime;
    this.IsLogin = model.IsLogin;
    this.IsLogout = model.IsLogout;
    this.CreatedOn = model.CreatedOn;
    this.UpdatedOn = model.UpdatedOn;
    this.DeletedOn = model.DeletedOn;
};

userModel.userLogin = async (UserMobileNo) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserMobileNo', sql.VarChar(20), UserMobileNo)
            .query('SELECT * FROM Emk_Users WHERE UserMobileNo = @UserMobileNo AND IsActive = 1 AND IsDeleted = 0');
        return result.recordset;
    }
};

userModel.userRegister = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserName', sql.NVarChar(50), data.UserName)
            .input('UserMobileNo', sql.NVarChar(20), data.UserMobileNo)
            .input('UserEmailAddress', sql.NVarChar(50), data.UserEmailAddress)
            .input('UserAddress', sql.NVarChar(100), data.UserAddress)
            .input('RoleId', sql.Int, data.RoleId)
            .input('UserPassword', sql.NVarChar(200), await hashPassword(data.UserPassword))
            .query(`INSERT INTO Emk_Users(UserName, UserMobileNo, UserEmailAddress, UserAddress, RoleId, UserPassword, IsActive, IsDeleted, CreatedOn, UpdatedOn)
            VALUES (@UserName, @UserMobileNo, @UserEmailAddress, @UserAddress, @RoleId, @UserPassword, 1, 0, GETDATE(), GETDATE())`);
        return result;
    }
};

userModel.checkInAndOut = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserId', sql.BigInt, data.UserId)
            .input('Location', sql.NVarChar(sql.MAX), data.Location)
            .input('Latitude', sql.Decimal(18, 6), data.Latitude)
            .input('Longitude', sql.Decimal(18, 6), data.Longitude)
            .execute('Emk_ProcessUserLogs');
        return result.recordset;
    }
}

userModel.getTotalUserCount = async () => {
    const pool = await poolPromise;
    const result = await pool.request()
        .query('SELECT COUNT(UserId) AS TotalUsers FROM Emk_Users');
    return result.recordset;
}

userModel.getUsers = async (data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('PageNumber', sql.Int, data.PageNumber)
        .input('PageSize', sql.Int, data.PageSize)
        // .query('SELECT UserId, UserName, UserMobileNo, UserAddress, RoleId FROM Emk_Users WHERE IsActive = 1 AND IsDeleted = 0 ORDER BY UserId OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY');
        .query('SELECT t1.UserId, t1.UserName, t1.UserMobileNo, t1.UserEmailAddress, t1.UserAddress, t2.RoleName FROM Emk_Users t1 LEFT JOIN Emk_Roles t2 ON t1.RoleId = t2.RoleId WHERE t1.UserId != 1 AND t1.IsActive = 1 AND t1.IsDeleted = 0 ORDER BY UserId DESC');
    return result.recordset;
}

userModel.getUsersAttendace = async (data) => {
    let query = 'SELECT t2.UserName, t2.UserMobileNo, t3.RoleName, t1.InLocation, t1.OutLocation, t1.InLatitude, t1.InLongitude, t1.OutLatitude, t1.OutLongitude, CONVERT(VARCHAR(8), t1.InTime, 108) AS InTime, CONVERT(VARCHAR(8), t1.OutTime, 108) AS OutTime, t1.IsLogin, t1.IsLogout FROM Emk_UserLogs t1 LEFT JOIN Emk_Users t2 ON t1.UserId = t2.UserId LEFT JOIN Emk_Roles t3 ON t2.RoleId = t3.RoleId WHERE t1.IsActive = 1 AND t1.IsDeleted = 0';
    if (data.AttendanceDate) {
        query += ` AND CAST(t1.CreatedOn AS DATE) = CAST('${data.AttendanceDate}' AS DATE)`;
    }
    if (data.UserName) {
        query += ` AND t2.UserName = '${data.UserName}'`;
    }
    if (data.UserMobileNo) {
        query += ` AND t2.UserMobileNo = '${data.UserMobileNo}'`;
    }
    query += ` ORDER BY t1.Id DESC`;
    const pool = await poolPromise;
    const result = await pool.request()
        .query(query);
    return result.recordset;
}

userModel.getUserStatus = async (data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('UserId', sql.BigInt, data.UserId)
        .query('SELECT TOP 1 UserId, InLocation, OutLocation, InLatitude, InLongitude, OutLatitude, OutLongitude, InTime, OutTime, IsLogin, IsLogout FROM Emk_UserLogs WHERE UserId = @UserId AND IsActive = 1 AND IsDeleted = 0 ORDER BY Id DESC');
    return result.recordset;
}

userModel.saveToken = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserId', sql.BigInt, data.UserId)
            .input('UserToken', sql.NVarChar(sql.MAX), data.UserToken)
            .query('UPDATE Emk_Users SET UserToken = @UserToken WHERE UserId = @UserId AND IsActive = 1 AND IsDeleted = 0');
        return result;
    }
};

userModel.validateToken = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserId', sql.BigInt, data)
            .query('SELECT UserToken FROM Emk_Users WHERE UserId = @UserId AND IsActive = 1 AND IsDeleted = 0');
        return result.recordset;
    }
};

userModel.userLogout = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserId', sql.BigInt, data.UserId)
            .query('UPDATE Emk_Users SET UserToken = NULL WHERE UserId = @UserId AND IsActive = 1 AND IsDeleted = 0');
        return result;
    }
};

module.exports = userModel;