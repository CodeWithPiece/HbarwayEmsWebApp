const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');
const validateRequest = require('../middlewares/authMiddleware');

router.post('/roles', validateRequest, masterController.getRoles);
router.post('/district', validateRequest, masterController.getDistrict);
router.post('/block', validateRequest, masterController.getBlockByDistrict);
router.post('/village', validateRequest, masterController.getVillageByBLock);
router.post('/dashboard', validateRequest, masterController.getDashboardData);

module.exports = router;