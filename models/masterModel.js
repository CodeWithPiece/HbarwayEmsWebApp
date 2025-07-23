const { sql, poolPromise } = require('../config/db');

const masterModel = function (model) {
    this.UserId = model.UserId;
    this.Id = model.Id;
    this.StateId = model.StateId;
    this.DistrictId = model.DistrictId;
    this.BlockId = model.BlockId;
    this.Title = model.Title;
    this.Code = model.Code;
    this.IsActive = model.IsActive;
    this.IsDeleted = model.IsDeleted;
    this.CreatedOn = model.CreatedOn;
    this.UpdatedOn = model.UpdatedOn;
    this.DeleteOn = model.DeleteOn;
};

masterModel.getRoles = async () => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .query('SELECT RoleId, RoleName, IsActive FROM Emk_Roles WHERE IsActive = 1 AND IsDeleted = 0');
        return result.recordset;
    }
};

masterModel.getDistrict = async () => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .query('SELECT Id, Title FROM Emk_MasterDistricts WHERE IsActive = 1 AND IsDeleted = 0');
        return result.recordset;
    }
};

masterModel.getBlockByDistrict = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('DistrictId', sql.Int, data.DistrictId)
            .query('SELECT Id, DistrictId, Title FROM Emk_MasterBlocks WHERE DistrictId = @DistrictId AND IsActive = 1 AND IsDeleted = 0');
        return result.recordset;
    }
};

masterModel.getVillageByBlock = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('BlockId', sql.Int, data.BlockId)
            .query('SELECT Id, BLockId, Title FROM Emk_MasterVillages WHERE BlockId = @BlockId AND IsActive = 1 AND IsDeleted = 0');
        return result.recordset;
    }
};

masterModel.getDashboardData = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserId', sql.BigInt, data.UserId)
            .input('Month', sql.Int, data.Month)
            .input('Year', sql.Int, data.Year)
            .execute('Emk_GetDashboardDetails');
        return result.recordset;
    }
}

module.exports = masterModel;