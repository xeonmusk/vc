const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskAnalytics, updateTaskStatus } = require('../controllers/taskController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

router.get('/', verifyToken, getAllTasks);
router.post('/create', verifyToken, checkRole(['admin']), createTask);
router.get('/analytics', verifyToken, checkRole(['admin']), getTaskAnalytics);
router.put('/:id/status', verifyToken, updateTaskStatus);

module.exports = router;
