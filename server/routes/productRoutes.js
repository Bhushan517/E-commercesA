const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();

// GET /api/products - Get all products
router.get('/', ProductController.getAllProducts);

// GET /api/products/search/:term - Search products
router.get('/search/:term', ProductController.searchProducts);

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', ProductController.getProductsByCategory);

// GET /api/products/:id - Get single product
router.get('/:id', ProductController.getProductById);

// POST /api/products - Create new product
router.post('/', ProductController.createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', ProductController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
