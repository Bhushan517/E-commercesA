const express = require('express');
const CartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { apiLimiter, dataLimiter } = require('../middleware/security');

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);
router.use(apiLimiter);

// Validation middleware for cart operations
const validateAddToCart = [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 999 })
    .withMessage('Quantity must be between 1 and 999'),
  handleValidationErrors
];

const validateUpdateCart = [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('quantity')
    .isInt({ min: 1, max: 999 })
    .withMessage('Quantity must be between 1 and 999'),
  handleValidationErrors
];

const validateRemoveFromCart = [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  handleValidationErrors
];

const validateSyncCart = [
  body('cartItems')
    .isArray()
    .withMessage('Cart items must be an array'),
  body('cartItems.*.id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('cartItems.*.quantity')
    .optional()
    .isInt({ min: 1, max: 999 })
    .withMessage('Quantity must be between 1 and 999'),
  handleValidationErrors
];

// GET /api/cart - Get user's cart items
router.get('/', CartController.getCart);

// GET /api/cart/summary - Get cart summary
router.get('/summary', CartController.getCartSummary);

// POST /api/cart/add - Add item to cart
router.post('/add', dataLimiter, validateAddToCart, CartController.addToCart);

// PUT /api/cart/update - Update cart item quantity
router.put('/update', dataLimiter, validateUpdateCart, CartController.updateCartItem);

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove', dataLimiter, validateRemoveFromCart, CartController.removeFromCart);

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', dataLimiter, CartController.clearCart);

// POST /api/cart/sync - Sync cart from localStorage
router.post('/sync', dataLimiter, validateSyncCart, CartController.syncCart);

module.exports = router;
