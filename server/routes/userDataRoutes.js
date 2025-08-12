const express = require('express');
const UserDataController = require('../controllers/userDataController');
const { authenticateToken } = require('../middleware/auth');
const { validateUserData, validateId, validateUserDataQuery } = require('../middleware/validation');
const { apiLimiter, dataLimiter } = require('../middleware/security');

const router = express.Router();

// All routes require authentication and rate limiting
router.use(authenticateToken);
router.use(apiLimiter);

// GET /api/user-data/stats - Get user data statistics
router.get('/stats', UserDataController.getUserDataStats);

// GET /api/user-data - Get all user data for authenticated user
router.get('/', validateUserDataQuery, UserDataController.getUserData);

// GET /api/user-data/:id - Get single user data item
router.get('/:id', validateId, UserDataController.getUserDataById);

// POST /api/user-data - Create new user data
router.post('/', dataLimiter, validateUserData, UserDataController.createUserData);

// PUT /api/user-data/:id - Update user data
router.put('/:id', dataLimiter, validateId, validateUserData, UserDataController.updateUserData);

// DELETE /api/user-data/:id - Delete user data
router.delete('/:id', dataLimiter, validateId, UserDataController.deleteUserData);

module.exports = router;
