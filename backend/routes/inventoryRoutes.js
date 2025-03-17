const express = require('express');
const router = express.Router();
const { getAllInventory, addInventoryItem, updateInventory, checkInventoryAlerts, getInventoryAnalytics } = require('../controllers/inventoryController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

router.get('/', verifyToken, getAllInventory);
router.post('/add', verifyToken, checkRole(['admin']), addInventoryItem);
router.put('/:id', verifyToken, checkRole(['admin']), updateInventory);
router.get('/alerts', verifyToken, checkRole(['admin']), checkInventoryAlerts);
router.get('/analytics', verifyToken, checkRole(['admin']), getInventoryAnalytics);

module.exports = router;
