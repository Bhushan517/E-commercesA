const { Order, OrderItem, User, Product } = require('../models');

class OrderService {
  // Get all orders
  static async getAllOrders() {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'image']
              }
            ]
          }
        ],
        order: [['id', 'DESC']]
      });
      return orders;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  // Get order by ID
  static async getOrderById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid order ID');
      }

      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'image']
              }
            ]
          }
        ]
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  // Get orders by user ID
  static async getOrdersByUserId(userId) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'image']
              }
            ]
          }
        ],
        order: [['id', 'DESC']]
      });

      return orders;
    } catch (error) {
      throw new Error(`Failed to fetch user orders: ${error.message}`);
    }
  }

  // Create new order
  static async createOrder(orderData) {
    const transaction = await Order.sequelize.transaction();

    try {
      const { user_id, items } = orderData;

      // Validate required fields
      if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        throw new Error('User ID and items are required');
      }

      // Validate user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate items and calculate total
      let totalPrice = 0;
      const validatedItems = [];

      for (const item of items) {
        if (!item.product_id || !item.quantity || item.quantity <= 0) {
          throw new Error('Each item must have valid product_id and quantity');
        }

        const product = await Product.findByPk(item.product_id);
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        totalPrice += parseFloat(product.price) * item.quantity;
        validatedItems.push({
          productId: item.product_id,
          quantity: item.quantity
        });
      }

      // Create order
      const order = await Order.create({
        userId: user_id,
        totalPrice: totalPrice
      }, { transaction });

      // Create order items
      for (const item of validatedItems) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity
        }, { transaction });
      }

      await transaction.commit();

      // Return order with all related data
      return await this.getOrderById(order.id);
    } catch (error) {
      await transaction.rollback();

      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  // Update order status
  static async updateOrderStatus(id, status) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid order ID');
      }

      const validStatuses = ['pending', 'shipped', 'delivered'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be: pending, shipped, or delivered');
      }

      const order = await Order.findByPk(id);
      if (!order) {
        throw new Error('Order not found');
      }

      // Update order status
      await order.update({ status });

      // Return updated order with all related data
      return await this.getOrderById(id);
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      throw new Error(`Failed to update order: ${error.message}`);
    }
  }

  // Delete order
  static async deleteOrder(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid order ID');
      }

      const order = await Order.findByPk(id);
      if (!order) {
        throw new Error('Order not found');
      }

      // Delete order (OrderItems will be deleted automatically due to CASCADE)
      await order.destroy();
      return { message: 'Order deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  }
}

module.exports = OrderService;
