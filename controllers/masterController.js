const masterModel = require('../models/masterModel');

exports.getRoles = async (req, res) => {
    try {
        const response = await masterModel.getRoles();
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Roles not found." });
        } else {
            return res.status(200).json({ status: true, message: "Roles fetched successfully.", data: response });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }

}

exports.getDistrict = async (req, res) => {
    try {
        const response = await masterModel.getDistrict();
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "District not found." });
        } else {
            return res.status(200).json({ status: true, message: "District fetched successfully.", data: response });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }

}

exports.getBlockByDistrict = async (req, res) => {
    try {
        const response = await masterModel.getBlockByDistrict(req.body);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Block not found." });
        } else {
            return res.status(200).json({ status: true, message: "Block fetched successfully.", data: response });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }

}

exports.getVillageByBLock = async (req, res) => {
    try {
        const response = await masterModel.getVillageByBlock(req.body);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Village not found." });
        } else {
            return res.status(200).json({ status: true, message: "Village fetched successfully.", data: response });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

exports.getDashboardData = async (req, res) => {
    try {
        const response = await masterModel.getDashboardData(req.body);
        if (response) {
            return res.status(200).json({ status: true, message: "Dashboard data fetched successfully.", data: response[0] });
        } else {
            return res.status(400).json({ status: false, message: "Dashboard data fetched failed." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: `Internal server error: ${err.message}` });
    }
}