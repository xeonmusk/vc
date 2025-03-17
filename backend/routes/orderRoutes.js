const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder, updateOrderStatus, getOrderAnalytics } = require('../controllers/orderController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

router.get('/', verifyToken, getAllOrders);
router.post('/create', verifyToken, createOrder);
router.put('/:id/status', verifyToken, checkRole(['admin']), updateOrderStatus);
router.get('/analytics', verifyToken, checkRole(['admin']), getOrderAnalytics);

module.exports = router;
