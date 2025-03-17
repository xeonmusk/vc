const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct } = require('../controllers/productController');

// Get all products
router.get('/', getAllProducts);

// Add new product
router.post('/add', addProduct);

module.exports = router;
