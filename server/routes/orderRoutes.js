const express = require('express');
const OrderController = require('../controllers/orderController');

const router = express.Router();

// GET /api/orders - Get all orders
router.get('/', OrderController.getAllOrders);

// GET /api/orders/user/:userId - Get orders by user ID
router.get('/user/:userId', OrderController.getOrdersByUserId);

// GET /api/orders/:id - Get single order
router.get('/:id', OrderController.getOrderById);

// POST /api/orders - Create new order
router.post('/', OrderController.createOrder);

// PUT /api/orders/:id - Update order status
router.put('/:id', OrderController.updateOrderStatus);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
