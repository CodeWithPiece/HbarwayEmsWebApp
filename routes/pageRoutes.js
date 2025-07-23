const express = require('express');
const path = require('path');
const router = express.Router();

const publicPages = path.join(__dirname, '..', 'public', 'pages');

router.get('/', (req, res) => {
    res.sendFile(path.join(publicPages, 'login.html'));
});

router.get('/user-management', (req, res) => {
    res.sendFile(path.join(publicPages, 'add_user.html'));
});

router.get('/user-attendance', (req, res) => {
    res.sendFile(path.join(publicPages, 'user_attendance.html'));
});

router.get('/work-allotment', (req, res) => {
    res.sendFile(path.join(publicPages, 'work_allotment.html'));
});

router.get('/work-progress', (req, res) => {
    res.sendFile(path.join(publicPages, 'work_progress.html'));
});

router.get('/work-details', (req, res) => {
    res.sendFile(path.join(publicPages, 'work_details.html'));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(publicPages, 'index.html'));
});

router.get('/invalid-page', (req, res) => {
    res.sendFile(path.join(publicPages, '500.html'));
});

// router.get('/profile-details', (req, res) => {
//     res.sendFile(path.join(publicPages, 'profile.html'));
// });

module.exports = router;
