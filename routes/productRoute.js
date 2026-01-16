const express = require('express');
const {
    getAllProducts,
    getProducts,
    getProductDetails
} = require('../controllers/productController');

const router = express.Router();

// Public product routes (USED BY FRONTEND)
router.get('/products', getAllProducts);
router.get('/products/all', getProducts);
router.get('/product/:id', getProductDetails);

module.exports = router;
