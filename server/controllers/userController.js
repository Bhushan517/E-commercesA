const UserService = require('../services/userService');

class UserController {
  // GET /users - Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /users/:id - Get single user
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /users/register - Register new user
  static async registerUser(req, res) {
    try {
      const userData = req.body;
      const user = await UserService.registerUser(userData);
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'User registered successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /users/login - Login user
  static async loginUser(req, res) {
    try {
      const credentials = req.body;
      const user = await UserService.loginUser(credentials);
      
      res.json({
        success: true,
        data: user,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /users/:id - Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await UserService.updateUser(id, userData);
      
      res.json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /users/:id - Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UserController;
