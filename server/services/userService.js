const { User } = require('../models');
const { generateUserToken } = require('../utils/jwt');

class UserService {
  // Get all users
  static async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
        order: [['id', 'DESC']]
      });
      return users;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  // Get user by ID
  static async getUserById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid user ID');
      }

      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  // Register new user
  static async registerUser(userData) {
    try {
      const { name, email, password } = userData;

      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create user and generate JWT token
      const user = await User.create({ name, email, password });
      const token = generateUserToken(user);
      return {
        user: user.toSafeJSON(),
        token
      };
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Email already registered');
      }

      throw new Error(`Failed to register user: ${error.message}`);
    }
  }

  // Login user
  static async loginUser(credentials) {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      const token = generateUserToken(user);
      return {
        user: user.toSafeJSON(),
        token
      };
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }

  // Update user
  static async updateUser(id, userData) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid user ID');
      }

      // Find user
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if email is already taken by another user
      if (userData.email && userData.email !== user.email) {
        const existingEmailUser = await User.findOne({ where: { email: userData.email } });
        if (existingEmailUser) {
          throw new Error('Email already taken');
        }
      }

      // Update user
      await user.update(userData);

      // Return updated user without password
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Email already taken');
      }

      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid user ID');
      }

      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }

      await user.destroy();
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}

module.exports = UserService;
