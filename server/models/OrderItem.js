const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define OrderItem model
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id', // Maps to order_id column in database
    validate: {
      notEmpty: {
        msg: 'Order ID is required'
      },
      isInt: {
        msg: 'Order ID must be an integer'
      }
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id', // Maps to product_id column in database
    validate: {
      notEmpty: {
        msg: 'Product ID is required'
      },
      isInt: {
        msg: 'Product ID must be an integer'
      }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Quantity must be an integer'
      },
      min: {
        args: [1],
        msg: 'Quantity must be at least 1'
      }
    }
  }
}, {
  tableName: 'order_items',
  indexes: [
    {
      fields: ['order_id'] // Use actual database column name
    },
    {
      fields: ['product_id'] // Use actual database column name
    }
  ]
});

module.exports = OrderItem;
