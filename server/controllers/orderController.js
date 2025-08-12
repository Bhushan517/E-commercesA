const OrderService = require('../services/orderService');

class OrderController {
  // GET /orders - Get all orders
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /orders/:id - Get single order
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /orders/user/:userId - Get orders by user ID
  static async getOrdersByUserId(req, res) {
    try {
      const { userId } = req.params;
      const requestingUserId = req.user.id;

      // Users can only access their own orders
      if (parseInt(userId) !== requestingUserId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only view your own orders.'
        });
      }

      const orders = await OrderService.getOrdersByUserId(userId);

      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /orders - Create new order
  static async createOrder(req, res) {
    try {
      const orderData = req.body;
      const authenticatedUserId = req.user.id;

      // Ensure the order is created for the authenticated user
      orderData.user_id = authenticatedUserId;

      const order = await OrderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /orders/from-cart - Create order from cart items
  static async createOrderFromCart(req, res) {
    try {
      const userId = req.user.id;
      const order = await OrderService.createOrderFromCart(userId);

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully from cart'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /orders/:id - Update order status
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required'
        });
      }

      const order = await OrderService.updateOrderStatus(id, status);
      
      res.json({
        success: true,
        data: order,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /orders/:id - Delete order
  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await OrderService.deleteOrder(id);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = OrderController;
