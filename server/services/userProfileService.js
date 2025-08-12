const { UserProfile, User } = require('../models');

class UserProfileService {
  // Get user profile
  static async getUserProfile(userId) {
    try {
      let profile = await UserProfile.findOne({
        where: { userId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      // If profile doesn't exist, create a default one
      if (!profile) {
        profile = await UserProfile.create({ userId });
        // Fetch again with user data
        profile = await UserProfile.findOne({
          where: { userId },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        });
      }

      return profile;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  // Update user profile (with ownership check)
  static async updateUserProfile(userId, profileData) {
    try {
      // Find or create profile
      let profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        // Create new profile with the provided data
        profile = await UserProfile.create({
          userId,
          ...profileData
        });
      } else {
        // Update existing profile
        await profile.update(profileData);
      }

      // Return updated profile with user information
      return await this.getUserProfile(userId);
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }

  // Delete user profile (with ownership check)
  static async deleteUserProfile(userId) {
    try {
      const profile = await UserProfile.findOne({ where: { userId } });

      if (!profile) {
        throw new Error('Profile not found');
      }

      await profile.destroy();
      return { message: 'User profile deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user profile: ${error.message}`);
    }
  }

  // Update user preferences
  static async updateUserPreferences(userId, preferences) {
    try {
      let profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        // Create new profile with preferences
        profile = await UserProfile.create({
          userId,
          preferences
        });
      } else {
        // Merge with existing preferences
        const currentPreferences = profile.preferences || {};
        const updatedPreferences = { ...currentPreferences, ...preferences };
        
        await profile.update({ preferences: updatedPreferences });
      }

      return await this.getUserProfile(userId);
    } catch (error) {
      throw new Error(`Failed to update user preferences: ${error.message}`);
    }
  }
}

module.exports = UserProfileService;
