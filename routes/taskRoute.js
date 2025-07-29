const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateRequest = require('../middlewares/authMiddleware');

router.post('/create', validateRequest, taskController.createTask);
router.post('/update', validateRequest, taskController.updateTask);
router.post('/getUserTask', validateRequest, taskController.getUserTasks);
router.post('/getTasks', validateRequest, taskController.getTasks);


module.exports = router;