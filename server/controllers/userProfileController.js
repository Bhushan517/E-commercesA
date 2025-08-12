const UserProfileService = require('../services/userProfileService');

class UserProfileController {
  // GET /api/profile - Get user profile for authenticated user
  static async getUserProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const profile = await UserProfileService.getUserProfile(userId);
      
      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /api/profile - Update user profile
  static async updateUserProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      console.log('Updating profile for user:', userId);
      console.log('Profile data received:', profileData);

      const profile = await UserProfileService.updateUserProfile(userId, profileData);

      res.json({
        success: true,
        data: profile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Profile update error in controller:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /api/profile - Delete user profile
  static async deleteUserProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await UserProfileService.deleteUserProfile(userId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /api/profile/preferences - Update user preferences
  static async updateUserPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = req.body;
      
      const profile = await UserProfileService.updateUserPreferences(userId, preferences);
      
      res.json({
        success: true,
        data: profile,
        message: 'Preferences updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UserProfileController;
