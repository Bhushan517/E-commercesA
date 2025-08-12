const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for data creation/modification
const dataLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 data operations per windowMs
  message: {
    success: false,
    error: 'Too many data operations, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API usage
});

// Sanitize user input to prevent XSS
const sanitizeInput = (req, _res, next) => {
  // Recursively sanitize all string values in req.body
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove potentially dangerous HTML tags and scripts
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  next();
};

// Log security events (simplified)
const logSecurityEvent = (event, req) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Security Event: ${event} from ${req.ip}`);
  }
};

// Middleware to log failed authentication attempts
const logFailedAuth = (req, res, next) => {
  const originalSend = res.send;

  res.send = function(data) {
    if (res.statusCode === 401 || res.statusCode === 403) {
      logSecurityEvent('AUTH_FAILED', req);
    }
    originalSend.call(this, data);
  };

  next();
};

module.exports = {
  authLimiter,
  apiLimiter,
  dataLimiter,
  securityHeaders,
  sanitizeInput,
  logSecurityEvent,
  logFailedAuth
};
