const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// Admin-only route
router.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome, Admin!' });
});

// User and Admin route
router.get('/user', verifyToken, checkRole(['user', 'admin']), (req, res) => {
  res.status(200).json({ message: 'Hello, User!' });
});

module.exports = router;
