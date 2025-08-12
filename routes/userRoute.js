const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateRequest = require('../middlewares/authMiddleware');

router.post('/login', userController.userLogin);
router.post('/register', userController.userRegister);
router.post('/update', userController.userUpdate);
router.post('/checkInAndOut', userController.checkInAndOut);
router.post('/getStatus', userController.getUserStatus);
router.post('/getUsersCount', validateRequest, userController.getTotalUserCount);
router.post('/getUsers', validateRequest, userController.getUsers);
router.post('/logout', userController.userLogout);
router.post('/attendance', validateRequest, userController.getUsersAttendace);


module.exports = router;