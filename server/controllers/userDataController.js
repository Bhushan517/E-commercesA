const UserDataService = require('../services/userDataService');

class UserDataController {
  // GET /api/user-data - Get all user data for authenticated user
  static async getUserData(req, res) {
    try {
      const userId = req.user.id;
      const { category, isPrivate } = req.query;
      
      const filters = {};
      if (category) filters.category = category;
      if (isPrivate !== undefined) filters.isPrivate = isPrivate === 'true';

      const userData = await UserDataService.getUserData(userId, filters);
      
      res.json({
        success: true,
        data: userData,
        count: userData.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/user-data/:id - Get single user data item
  static async getUserDataById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const userData = await UserDataService.getUserDataById(id, userId);
      
      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || error.message.includes('access denied') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /api/user-data - Create new user data
  static async createUserData(req, res) {
    try {
      const userId = req.user.id;
      const dataInfo = req.body;
      
      const userData = await UserDataService.createUserData(userId, dataInfo);
      
      res.status(201).json({
        success: true,
        data: userData,
        message: 'User data created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /api/user-data/:id - Update user data
  static async updateUserData(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;
      
      const userData = await UserDataService.updateUserData(id, userId, updateData);
      
      res.json({
        success: true,
        data: userData,
        message: 'User data updated successfully'
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || error.message.includes('access denied') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /api/user-data/:id - Delete user data
  static async deleteUserData(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const result = await UserDataService.deleteUserData(id, userId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || error.message.includes('access denied') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/user-data/stats - Get user data statistics
  static async getUserDataStats(req, res) {
    try {
      const userId = req.user.id;
      
      const stats = await UserDataService.getUserDataStats(userId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UserDataController;
