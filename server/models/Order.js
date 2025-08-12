const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define Order model
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id', // Maps to user_id column in database
    validate: {
      notEmpty: {
        msg: 'User ID is required'
      },
      isInt: {
        msg: 'User ID must be an integer'
      }
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_price', // Maps to total_price column in database
    validate: {
      isDecimal: {
        msg: 'Total price must be a valid decimal number'
      },
      min: {
        args: [0.01],
        msg: 'Total price must be greater than 0'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'shipped', 'delivered'),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'shipped', 'delivered']],
        msg: 'Status must be pending, shipped, or delivered'
      }
    }
  }
}, {
  tableName: 'orders',
  indexes: [
    {
      fields: ['user_id'] // Use actual database column name
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Order;
