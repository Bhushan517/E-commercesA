const express = require('express');
const OrderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/orders - Get all orders (admin only)
router.get('/', OrderController.getAllOrders);

// GET /api/orders/user/:userId - Get orders by user ID (authenticated)
router.get('/user/:userId', authenticateToken, OrderController.getOrdersByUserId);

// GET /api/orders/:id - Get single order (authenticated)
router.get('/:id', authenticateToken, OrderController.getOrderById);

// POST /api/orders - Create new order (authenticated)
router.post('/', authenticateToken, OrderController.createOrder);

// POST /api/orders/from-cart - Create order from cart items (authenticated)
router.post('/from-cart', authenticateToken, OrderController.createOrderFromCart);

// PUT /api/orders/:id - Update order status
router.put('/:id', OrderController.updateOrderStatus);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
