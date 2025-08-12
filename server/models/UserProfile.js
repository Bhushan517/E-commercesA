const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define UserProfile model for extended user information
const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
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
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'first_name',
    validate: {
      len: {
        args: [0, 100],
        msg: 'First name must be less than 100 characters'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'last_name',
    validate: {
      len: {
        args: [0, 100],
        msg: 'Last name must be less than 100 characters'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'Phone number must be less than 20 characters'
      }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth',
    validate: {
      isDate: {
        msg: 'Date of birth must be a valid date'
      },
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'Date of birth must be in the past'
      }
    }
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Avatar must be a valid URL'
      }
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Bio must be less than 1000 characters'
      }
    }
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    validate: {
      isValidJSON(value) {
        if (value && typeof value !== 'object') {
          throw new Error('Preferences must be a valid JSON object');
        }
      }
    }
  }
}, {
  tableName: 'user_profiles',
  indexes: [
    {
      unique: true,
      fields: ['user_id']
    }
  ]
});

module.exports = UserProfile;
