const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, validateId } = require('../middleware/validation');
const { authLimiter, apiLimiter } = require('../middleware/security');

const router = express.Router();

// Authentication routes (with rate limiting)
// POST /api/users/register - Register new user
router.post('/register', authLimiter, validateUserRegistration, UserController.registerUser);

// POST /api/users/login - Login user
router.post('/login', authLimiter, validateUserLogin, UserController.loginUser);

// Protected routes (require authentication)
// GET /api/users - Get all users (admin only - for demo purposes)
router.get('/', apiLimiter, authenticateToken, UserController.getAllUsers);

// GET /api/users/:id - Get single user
router.get('/:id', apiLimiter, authenticateToken, validateId, UserController.getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', apiLimiter, authenticateToken, validateId, UserController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', apiLimiter, authenticateToken, validateId, UserController.deleteUser);

module.exports = router;
