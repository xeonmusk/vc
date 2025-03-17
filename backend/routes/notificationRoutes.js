const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, getUserNotifications);
router.put('/:id/read', verifyToken, markAsRead);

module.exports = router;
