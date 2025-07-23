const express = require('express');
const router = express.Router();
const taskDocumentController = require('../controllers/taskDocumentController');
const validateRequest = require('../middlewares/authMiddleware');

router.post('/upload', validateRequest, taskDocumentController.uploadDocument);
router.post('/getDocuments', validateRequest, taskDocumentController.getUploadedDocuments);
router.post('/getDocumentsByUser', validateRequest, taskDocumentController.getDocumentsByUser);


module.exports = router;