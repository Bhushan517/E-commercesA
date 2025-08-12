const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

// Middleware to verify JWT token and authenticate user
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Middleware to check if user owns the resource
const authorizeOwner = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    try {
      const resourceUserId = req.params.userId || req.body[resourceUserIdField] || req.query.userId;
      
      // If no specific user ID is provided, allow (for creating new resources)
      if (!resourceUserId) {
        return next();
      }

      // Check if the authenticated user is trying to access their own data
      if (parseInt(resourceUserId) !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied - you can only access your own data'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Authorization failed'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeOwner
};
