const crypto = require('crypto');
const path = require("path");
const taskDocumentModel = require('../models/taskDocumentModel');

exports.uploadDocument = async (req, res) => {
    try {
        const { InstallationType, IsDefective } = req.body;
        const __dirname = path.resolve(path.dirname(__filename), "../");
        let taskDocumentData = null;
        if (InstallationType == 1) {
            const imageNew = req.files.DocumentNewUrl;
            const imageNameNew = crypto.randomUUID();
            imageNew.mv(`${__dirname}/public/images/${imageNameNew}.jpg`, async (err) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "Error while saving image." });
                }
            })
            taskDocumentData = { ...req.body, DocumentOldUrl: null, DocumentNewUrl: `/images/${imageNameNew}.jpg` }
        }
        if (InstallationType == 2) {
            const imageOld = req.files.DocumentOldUrl;
            const imageNew = req.files.DocumentNewUrl;
            const imageNameOld = crypto.randomUUID();
            const imageNameNew = crypto.randomUUID();
            imageOld.mv(`${__dirname}/public/images/${imageNameOld}.jpg`, (err) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "Error while saving image." });
                }
            })
            imageNew.mv(`${__dirname}/public/images/${imageNameNew}.jpg`, async (err) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "Error while saving image." });
                }
            })
            taskDocumentData = { ...req.body, DocumentOldUrl: `/images/${imageNameOld}.jpg`, DocumentNewUrl: `/images/${imageNameNew}.jpg` }
        }
        if (IsDefective == 1) {
            const imageDefect = req.files.DocumentDefectUrl;
            const imageNameDefect = crypto.randomUUID();
            imageDefect.mv(`${__dirname}/public/images/${imageNameDefect}.jpg`, async (err) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "Error while saving image." });
                }
            })
            taskDocumentData = { ...taskDocumentData, DocumentDefectUrl: `/images/${imageNameDefect}.jpg` }
        } else {
            taskDocumentData = { ...taskDocumentData, DocumentDefectUrl: null }
        }
        const response = await taskDocumentModel.uploadDocument(taskDocumentData);
        if (response.rowsAffected && response.rowsAffected[0] === 1) {
            return res.status(200).json({ status: true, message: "Task document created successfully." });
        } else {
            return res.status(400).json({ status: false, message: "Task document creation failed, please check all fields." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

exports.getUploadedDocuments = async (req, res) => {
    try {
        const response = await taskDocumentModel.getUploadedDocuments(req.body);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Documents not found." });
        } else {
            return res.status(200).json({ status: true, message: "Documents fetched successfully.", data: response });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }
}

exports.getDocumentsByUser = async (req, res) => {
    try {
        const response = await taskDocumentModel.getDocumentsByUser(req.body);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Documents not found." });
        } else {
            return res.status(200).json({ status: true, message: "Documents fetched successfully.", data: response });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }
}