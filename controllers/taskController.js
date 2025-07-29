const fs = require('fs');
const crypto = require('crypto');
const path = require("path");
const taskModel = require('../models/taskModel');

exports.createTask = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ status: false, message: "TaskImage is missing." });
        }
        const image = req.files.TaskImage;
        const imageName = crypto.randomUUID();
        const __dirname = path.resolve(path.dirname(__filename), "../");
        image.mv(`${__dirname}/public/images/${imageName}.jpg`, (err) => {
            if (err) {
                return res.status(500).json({ status: false, message: "Error while saving image." });
            }
        })
        const taskData = { ...req.body, TaskImage: `/images/${imageName}.jpg` }
        const response = await taskModel.createTask(taskData);
        if (response.rowsAffected && response.rowsAffected[0] === 1) {
            return res.status(200).json({ status: true, message: "Task created successfully." });
        } else {
            return res.status(400).json({ status: false, message: "Task creation failed, please check all fields." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

exports.updateTask = async (req, res) => {
    try {
        let taskData = { ...req.body };
        if (req.files) {
            const image = req.files.TaskImage;
            const imageName = crypto.randomUUID();
            const __dirname = path.resolve(path.dirname(__filename), "../");

            if (req.body.TaskImageUrl) {
                const oldImagePath = path.join(__dirname, 'public', req.body.TaskImageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            return res.status(500).json({ status: false, message: "Error while deleting old image." });
                        }
                    });
                }
            }

            image.mv(`${__dirname}/public/images/${imageName}.jpg`, (err) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "Error while saving image." });
                }
            })
            taskData = { ...req.body, TaskImage: `/images/${imageName}.jpg` }
        }
        const response = await taskModel.updateTask(taskData);
        if (response.rowsAffected && response.rowsAffected[0] === 1) {
            return res.status(200).json({ status: true, message: "Task updated successfully." });
        } else {
            return res.status(400).json({ status: false, message: "Task updation failed, please check all fields." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}


exports.getUserTasks = async (req, res) => {
    try {
        const response = await taskModel.getUserTasks(req.body);
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Task not found." });
        } else {
            return res.status(200).json({ status: true, message: "Available tasks.", data: response });
        }
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }

}

exports.getTasks = async (req, res) => {
    try {
        const response = await taskModel.getTasks();
        if (response.length === 0) {
            return res.status(400).json({ status: false, message: "Task not found." });
        } else {
            return res.status(200).json({ status: true, message: "Available tasks.", data: response });
        }
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }

}