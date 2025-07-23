const { sql, poolPromise } = require('../config/db');

const taskDocumentModel = function (model) {
    this.DocumentId = model.DocumentId;
    this.UserId = model.UserId;
    this.TaskId = model.TaskId;
    this.SerialNumber = model.SerialNumber;
    this.InstallationType = model.InstallationType;
    this.IsDefective = model.IsDefective;
    this.AreaPincode = model.AreaPincode;
    this.PoliceStation = model.PoliceStation;
    this.PostOffice = model.PostOffice;
    this.HouseNumber = model.HouseNumber;
    this.HouseAddress = model.HouseAddress;
    this.Latitude = model.Latitude;
    this.Longitude = model.Longitude;
    this.ConsumerName = model.ConsumerName;
    this.ConsumerNumber = model.ConsumerNumber;
    this.DocumentOldUrl = model.DocumentOldUrl;
    this.DocumentNewUrl = model.DocumentNewUrl;
    this.DocumentDefectUrl = model.DocumentDefectUrl;
    this.DocumentUploadLocation = model.DocumentUploadLocation;
    this.IsActive = model.IsActive;
    this.IsDeleted = model.IsDeleted;
    this.CreatedOn = model.CreatedOn;
    this.UpdatedOn = model.UpdatedOn;
    this.DeletedOn = model.DeletedOn;
};

taskDocumentModel.uploadDocument = async (data) => {
    const pool = await poolPromise;
    if (pool) {
        const result = await pool.request()
            .input('UserId', sql.BigInt, data.UserId)
            .input('TaskId', sql.BigInt, data.TaskId)
            .input('SerialNumber', sql.NVarChar(100), data.SerialNumber)
            .input('InstallationType', sql.Int, data.InstallationType)
            .input('IsDefective', sql.Int, data.IsDefective)
            .input('AreaPincode', sql.NVarChar(20), data.AreaPincode)
            .input('PoliceStation', sql.NVarChar(100), data.PoliceStation)
            .input('PostOffice', sql.NVarChar(100), data.PostOffice)
            .input('HouseNumber', sql.NVarChar(20), data.HouseNumber)
            .input('HouseAddress', sql.NVarChar(sql.MAX), data.HouseAddress)
            .input('Latitude', sql.Decimal(18, 6), data.Latitude)
            .input('Longitude', sql.Decimal(18, 6), data.Longitude)
            .input('ConsumerName', sql.NVarChar(50), data.ConsumerName)
            .input('ConsumerNumber', sql.NVarChar(100), data.ConsumerNumber)
            .input('DocumentOldUrl', sql.NVarChar(100), data.DocumentOldUrl)
            .input('DocumentNewUrl', sql.NVarChar(100), data.DocumentNewUrl)
            .input('DocumentDefectUrl', sql.NVarChar(100), data.DocumentDefectUrl)
            .input('DocumentUploadLocation', sql.NVarChar(sql.MAX), data.DocumentUploadLocation)
            .query(`INSERT INTO Emk_TaskDocuments(UserId, TaskId, SerialNumber, InstallationType, IsDefective, AreaPincode, PoliceStation, PostOffice, HouseNumber, HouseAddress, Latitude, Longitude, ConsumerName, ConsumerNumber, DocumentOldUrl, DocumentNewUrl, DocumentDefectUrl, DocumentUploadLocation, IsActive, IsDeleted, CreatedOn, UpdatedOn)
            VALUES (@UserId, @TaskId, @SerialNumber, @InstallationType, @IsDefective, @AreaPincode, @PoliceStation, @PostOffice, @HouseNumber, @HouseAddress, @Latitude, @Longitude, @ConsumerName, @ConsumerNumber, @DocumentOldUrl, @DocumentNewUrl, @DocumentDefectUrl, @DocumentUploadLocation, 1, 0, GETDATE(), GETDATE())`);
        return result;
    }
};

taskDocumentModel.getUploadedDocuments = async (data) => {
    let query = "SELECT t1.DocumentId, t1.TaskId, t2.UserName, t1.SerialNumber, CASE t1.InstallationType WHEN 1 THEN 'New Installation' WHEN 2 THEN 'Replace Device' END AS InstallationType , CASE t1.IsDefective WHEN 1 THEN 'Defective' WHEN 0 THEN 'Not Defective' END AS IsDefective, t1.AreaPincode, t1.PostOffice, t1.PoliceStation, t1.HouseNumber, t1.HouseAddress, t1.Latitude, t1.Longitude, t1.DocumentUploadLocation, t1.ConsumerName, t1.ConsumerNumber, t1.DocumentOldUrl, t1.DocumentNewUrl, t1.DocumentDefectUrl, t1.CreatedOn FROM Emk_TaskDocuments t1 LEFT JOIN Emk_Users t2 ON t1.UserId = t2.UserId LEFT JOIN Emk_Tasks t3 ON t1.TaskId = t3.TaskId WHERE t1.IsActive = 1 AND t1.IsDeleted = 0";
    if (data.SerialNumber) {
        query += ` AND t1.SerialNumber = '${data.SerialNumber}'`;
    }
    if (data.ConsumerName) {
        query += ` AND t1.ConsumerName = '${data.ConsumerName}'`;
    }
    if (data.UserName) {
        query += ` AND t2.UserName = '${data.UserName}'`;
    }
    query += ` ORDER BY t1.DocumentId DESC`;
    const pool = await poolPromise;
    const result = await pool.request()
        .query(query);
    return result.recordset;
}

taskDocumentModel.getDocumentsByUser = async (data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('UserId', sql.BigInt, data.UserId)
        .query("SELECT t1.DocumentId, t1.TaskId, t2.UserName, t1.SerialNumber, CASE t1.InstallationType WHEN 1 THEN 'New Installation' WHEN 2 THEN 'Replace Device' END AS InstallationType , CASE t1.IsDefective WHEN 1 THEN 'Defective' WHEN 0 THEN 'Not Defective' END AS IsDefective, t1.AreaPincode, t1.PostOffice, t1.PoliceStation, t1.HouseNumber, t1.HouseAddress, t1.Latitude, t1.Longitude, t1.DocumentUploadLocation, t1.ConsumerName, t1.ConsumerNumber, t1.DocumentOldUrl, t1.DocumentNewUrl, t1.DocumentDefectUrl, t1.CreatedOn FROM Emk_TaskDocuments t1 LEFT JOIN Emk_Users t2 ON t1.UserId = t2.UserId LEFT JOIN Emk_Tasks t3 ON t1.TaskId = t3.TaskId WHERE t1.UserId = @UserId AND t1.IsActive = 1 AND t1.IsDeleted = 0 ORDER BY t1.DocumentId DESC");
    return result.recordset;
}


module.exports = taskDocumentModel;