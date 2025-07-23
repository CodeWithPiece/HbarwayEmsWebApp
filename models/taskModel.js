const { sql, poolPromise } = require('../config/db');

const taskModel = function (model) {
    this.TaskId = model.TaskId;
    this.UserId = model.UserId;
    this.AssignedBy = model.AssignedBy;
    this.StateId = model.StateId;
    this.DistrictId = model.DistrictId;
    this.BlockId = model.BlockId;
    this.VillageId = model.VillageId;
    this.TaskName = model.TaskName;
    this.TaskDescription = model.TaskDescription;
    this.TaskImage = model.TaskImage;
    this.TaskAssignedDate = model.TaskAssignedDate;
    this.TaskEndDate = model.TaskEndDate;
    this.IsActive = model.IsActive;
    this.IsDeleted = model.IsDeleted;
    this.CreatedOn = model.CreatedOn;
    this.UpdatedOn = model.UpdatedOn;
    this.DeletedOn = model.DeletedOn;
};

taskModel.createTask = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserId', sql.BigInt, data.UserId)
            .input('AssignedBy', sql.BigInt, data.AssignedBy)
            .input('DistrictId', sql.Int, data.DistrictId)
            .input('BlockId', sql.Int, data.BlockId)
            .input('VillageId', sql.Int, data.VillageId)
            .input('TaskName', sql.NVarChar(50), data.TaskName)
            .input('TaskDescription', sql.NVarChar(sql.MAX), data.TaskDescription)
            .input('SerialNumberFrom', sql.NVarChar(50), data.SerialNumberFrom)
            .input('SerialNumberTo', sql.NVarChar(50), data.SerialNumberTo)
            .input('TaskCount', sql.Int, data.TaskCount)
            .input('TaskImage', sql.NVarChar(100), data.TaskImage)
            .input('TaskAssignedDate', sql.DateTime, data.TaskAssignedDate)
            .input('TaskEndDate', sql.DateTime, data.TaskEndDate)
            .query(`INSERT INTO Emk_Tasks(UserId, AssignedBy, StateId, DistrictId, BlockId, VillageId, TaskName, TaskDescription, SerialNumberFrom, SerialNumberTo, TaskCount, TaskImage, TaskAssignedDate, TaskEndDate, IsActive, IsDeleted, CreatedOn, UpdatedOn)
            VALUES (@UserId, @AssignedBy, 1, @DistrictId, @BlockId, @VillageId, @TaskName, @TaskDescription, @SerialNumberFrom, @SerialNumberTo, @TaskCount, @TaskImage, @TaskAssignedDate, @TaskEndDate, 1, 0, GETDATE(), GETDATE())`);
        return result;
    }
};

taskModel.getUserTasks = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserId', sql.BigInt, data.UserId)
            .query('SELECT t1.TaskId, t1.TaskName, t1.TaskDescription, t2.UserName AS AssignedTo, t3.UserName AS AssignedBy, t4.Title AS DistrictName, t5.Title AS BlockName, t6.Title AS VillageName, SerialNumberFrom, SerialNumberTo, TaskCount, TaskImage, CONVERT(VARCHAR(10), t1.TaskAssignedDate, 120) AS TaskAssignedDate, CONVERT(VARCHAR(10), t1.TaskEndDate, 120) AS TaskEndDate FROM Emk_Tasks t1 LEFT JOIN Emk_Users t2 ON t1.UserId = t2.UserId LEFT JOIN Emk_Users t3 ON t1.AssignedBy = t3.UserId LEFT JOIN Emk_MasterDistricts t4 On t1.DistrictId = t4.Id LEFT JOIN Emk_MasterBlocks t5 ON t1.BlockId = t5.Id LEFT JOIN Emk_MasterVillages t6 ON t1.VillageId = t6.Id WHERE t1.UserId = @UserId AND t1.IsDeleted = 0 AND t1.IsActive = 1 ORDER BY t1.TaskId ASC');

        // SELECT t1.TaskId, t1.TaskName, t1.TaskDescription, t2.UserName AS AssignedTo, t3.UserName AS AssignedBy, t4.Title AS DistrictName, t5.Title AS BlockName, t6.Title AS VillageName, SerialNumberFrom, SerialNumberTo, TaskCount, TaskImage, CONVERT(VARCHAR(10), t1.TaskAssignedDate, 120) AS TaskAssignedDate, CONVERT(VARCHAR(10), t1.TaskEndDate, 120) AS TaskEndDate FROM Emk_Tasks t1 LEFT JOIN Emk_Users t2 ON t1.UserId = t2.UserId LEFT JOIN Emk_Users t3 ON t1.AssignedBy = t3.UserId LEFT JOIN Emk_MasterDistricts t4 On t1.DistrictId = t4.Id LEFT JOIN Emk_MasterBlocks t5 ON t1.BlockId = t5.Id LEFT JOIN Emk_MasterVillages t6 ON t1.VillageId = t6.Id WHERE t1.UserId = @UserId AND t1.TaskEndDate > GETDATE() AND t1.IsDeleted = 0 AND t1.IsActive = 1 ORDER BY t1.TaskId ASC
        return result.recordset;
    }
};

taskModel.getTasks = async () => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .query('SELECT t1.TaskId, t1.TaskName, t1.TaskDescription, t2.UserName AS AssignedTo, t3.UserName AS AssignedBy, t4.Title AS DistrictName, t5.Title AS BlockName, t6.Title AS VillageName, SerialNumberFrom, SerialNumberTo, TaskCount, TaskImage, CONVERT(VARCHAR(10), t1.TaskAssignedDate, 120) AS TaskAssignedDate, CONVERT(VARCHAR(10), t1.TaskEndDate, 120) AS TaskEndDate FROM Emk_Tasks t1 LEFT JOIN Emk_Users t2 ON t1.UserId = t2.UserId LEFT JOIN Emk_Users t3 ON t1.AssignedBy = t3.UserId LEFT JOIN Emk_MasterDistricts t4 On t1.DistrictId = t4.Id LEFT JOIN Emk_MasterBlocks t5 ON t1.BlockId = t5.Id LEFT JOIN Emk_MasterVillages t6 ON t1.VillageId = t6.Id ORDER BY t1.TaskId DESC');
        return result.recordset;
    }
};

module.exports = taskModel;