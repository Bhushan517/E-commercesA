const express = require('express');
const UserProfileController = require('../controllers/userProfileController');
const { authenticateToken } = require('../middleware/auth');
const { validateUserProfile } = require('../middleware/validation');
const { apiLimiter, dataLimiter } = require('../middleware/security');

const router = express.Router();

// All routes require authentication (temporarily disable rate limiting)
router.use(authenticateToken);
// router.use(apiLimiter); // Temporarily disabled for testing

// GET /api/profile - Get user profile
router.get('/', UserProfileController.getUserProfile);

// PUT /api/profile - Update user profile (temporarily disable rate limiting)
router.put('/', validateUserProfile, UserProfileController.updateUserProfile);

// DELETE /api/profile - Delete user profile
router.delete('/', dataLimiter, UserProfileController.deleteUserProfile);

// PUT /api/profile/preferences - Update user preferences
router.put('/preferences', dataLimiter, UserProfileController.updateUserPreferences);

module.exports = router;
