const { UserData, User } = require('../models');

class UserDataService {
  // Get all user data for a specific user
  static async getUserData(userId, filters = {}) {
    try {
      const whereClause = { userId };
      
      // Add optional filters
      if (filters.category) {
        whereClause.category = filters.category;
      }
      
      if (filters.isPrivate !== undefined) {
        whereClause.isPrivate = filters.isPrivate;
      }

      const userData = await UserData.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return userData;
    } catch (error) {
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }
  }

  // Get single user data item by ID (with user ownership check)
  static async getUserDataById(id, userId) {
    try {
      const userData = await UserData.findOne({
        where: { id, userId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!userData) {
        throw new Error('Data not found or access denied');
      }

      return userData;
    } catch (error) {
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }
  }

  // Create new user data
  static async createUserData(userId, dataInfo) {
    try {
      const { title, content, category, isPrivate, metadata } = dataInfo;

      // Validate required fields
      if (!title) {
        throw new Error('Title is required');
      }

      // Create user data with userId automatically set
      const userData = await UserData.create({
        userId,
        title,
        content,
        category,
        isPrivate: isPrivate !== undefined ? isPrivate : true,
        metadata
      });

      // Return with user information
      return await this.getUserDataById(userData.id, userId);
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      throw new Error(`Failed to create user data: ${error.message}`);
    }
  }

  // Update user data (with ownership check)
  static async updateUserData(id, userId, updateData) {
    try {
      const userData = await UserData.findOne({
        where: { id, userId }
      });

      if (!userData) {
        throw new Error('Data not found or access denied');
      }

      // Update the data
      await userData.update(updateData);

      // Return updated data with user information
      return await this.getUserDataById(id, userId);
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      throw new Error(`Failed to update user data: ${error.message}`);
    }
  }

  // Delete user data (with ownership check)
  static async deleteUserData(id, userId) {
    try {
      const userData = await UserData.findOne({
        where: { id, userId }
      });

      if (!userData) {
        throw new Error('Data not found or access denied');
      }

      await userData.destroy();
      return { message: 'User data deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user data: ${error.message}`);
    }
  }

  // Get user data statistics
  static async getUserDataStats(userId) {
    try {
      const totalCount = await UserData.count({ where: { userId } });
      const privateCount = await UserData.count({ where: { userId, isPrivate: true } });
      const publicCount = await UserData.count({ where: { userId, isPrivate: false } });

      // Get categories count
      const categories = await UserData.findAll({
        where: { userId },
        attributes: ['category'],
        group: ['category'],
        raw: true
      });

      return {
        totalCount,
        privateCount,
        publicCount,
        categoriesCount: categories.length
      };
    } catch (error) {
      throw new Error(`Failed to get user data statistics: ${error.message}`);
    }
  }
}

module.exports = UserDataService;
