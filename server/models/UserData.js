const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define UserData model for storing user-specific data
const UserData = sequelize.define('UserData', {
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Title must be between 1 and 255 characters'
      }
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Category must be less than 100 characters'
      }
    }
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_private'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      isValidJSON(value) {
        if (value && typeof value !== 'object') {
          throw new Error('Metadata must be a valid JSON object');
        }
      }
    }
  }
}, {
  tableName: 'user_data',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['user_id', 'category']
    }
  ]
});

module.exports = UserData;
