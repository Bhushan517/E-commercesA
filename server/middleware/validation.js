const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// User data validation
const validateUserData = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .escape(),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Content must be less than 10000 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters')
    .escape(),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  body('metadata')
    .optional()
    .custom((value) => {
      if (value && typeof value !== 'object') {
        throw new Error('Metadata must be a valid JSON object');
      }
      return true;
    }),
  handleValidationErrors
];

// User profile validation
const validateUserProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name must be less than 100 characters')
    .escape(),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name must be less than 100 characters')
    .escape(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number must be less than 20 characters')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Phone number contains invalid characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      if (new Date(value) >= new Date()) {
        throw new Error('Date of birth must be in the past');
      }
      return true;
    }),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must be less than 1000 characters'),
  body('preferences')
    .optional()
    .custom((value) => {
      if (value && typeof value !== 'object') {
        throw new Error('Preferences must be a valid JSON object');
      }
      return true;
    }),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

// Query parameter validation for user data
const validateUserDataQuery = [
  query('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters')
    .escape(),
  query('isPrivate')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isPrivate must be true or false'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserData,
  validateUserProfile,
  validateId,
  validateUserDataQuery,
  handleValidationErrors
};
