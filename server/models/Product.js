const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define Product model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product name cannot be empty'
      },
      len: {
        args: [2, 255],
        msg: 'Product name must be between 2 and 255 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      },
      min: {
        args: [0.01],
        msg: 'Price must be greater than 0'
      }
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Image must be a valid URL'
      }
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Stock must be an integer'
      },
      min: {
        args: [0],
        msg: 'Stock cannot be negative'
      }
    }
  }
}, {
  tableName: 'products',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['name']
    }
  ]
});

module.exports = Product;
