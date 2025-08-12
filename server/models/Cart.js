const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define Cart model for storing user's cart items
const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    validate: {
      notEmpty: {
        msg: 'User ID is required'
      },
      isInt: {
        msg: 'User ID must be an integer'
      }
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
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
    defaultValue: 1,
    validate: {
      isInt: {
        msg: 'Quantity must be an integer'
      },
      min: {
        args: [1],
        msg: 'Quantity must be at least 1'
      },
      max: {
        args: [999],
        msg: 'Quantity cannot exceed 999'
      }
    }
  },
  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'added_at'
  }
}, {
  tableName: 'cart_items',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['product_id']
    },
    {
      unique: true,
      fields: ['user_id', 'product_id'] // Prevent duplicate items for same user
    }
  ],
  // Add hooks for automatic timestamp management
  hooks: {
    beforeUpdate: (cart) => {
      cart.addedAt = new Date();
    }
  }
});

module.exports = Cart;
