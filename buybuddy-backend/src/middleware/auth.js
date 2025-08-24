// src/middleware/auth.js
const { auth } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header required'
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
      email_verified: decodedToken.email_verified,
      picture: decodedToken.picture,
      role: decodedToken.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Token revoked',
        code: 'TOKEN_REVOKED'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Optional auth middleware
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;
        
      if (token) {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email,
          role: decodedToken.role || 'user'
        };
      }
    }
  } catch (error) {
    // Continue without authentication
    console.log('Optional auth failed:', error.message);
  }
  next();
};

module.exports = { 
  authenticateToken, 
  requireAdmin, 
  optionalAuth 
};

// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Firebase auth errors
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication error',
      code: err.code
    });
  }

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.details.map(d => d.message)
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large'
    });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
};

module.exports = errorHandler;

// src/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter
});

// Error handling for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 5MB allowed.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
  }
  
  if (err.message === 'Only image files are allowed (jpeg, jpg, png, gif, webp)') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

module.exports = { upload, handleMulterError };

// src/middleware/validation.js
const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.details.map(d => d.message)
      });
    }
    next();
  };
};

// Common validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required'
    }),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  product: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name must not exceed 100 characters',
      'any.required': 'Product name is required'
    }),
    description: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 1000 characters',
      'any.required': 'Product description is required'
    }),
    price: Joi.number().positive().precision(2).required().messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Product price is required'
    }),
    category: Joi.string().required().messages({
      'any.required': 'Product category is required'
    }),
    brand: Joi.string().optional(),
    stock: Joi.number().integer().min(0).required().messages({
      'number.integer': 'Stock must be a whole number',
      'number.min': 'Stock cannot be negative',
      'any.required': 'Stock quantity is required'
    }),
    images: Joi.array().items(Joi.string().uri()).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    specifications: Joi.object().optional()
  }),

  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required'
    }),
    comment: Joi.string().min(5).max(500).required().messages({
      'string.min': 'Review comment must be at least 5 characters long',
      'string.max': 'Review comment must not exceed 500 characters',
      'any.required': 'Review comment is required'
    }),
    productId: Joi.string().required().messages({
      'any.required': 'Product ID is required'
    })
  }),

  address: Joi.object({
    street: Joi.string().min(5).max(100).required().messages({
      'string.min': 'Street address must be at least 5 characters long',
      'any.required': 'Street address is required'
    }),
    city: Joi.string().min(2).max(50).required().messages({
      'string.min': 'City must be at least 2 characters long',
      'any.required': 'City is required'
    }),
    state: Joi.string().min(2).max(50).required().messages({
      'string.min': 'State must be at least 2 characters long',
      'any.required': 'State is required'
    }),
    zipCode: Joi.string().pattern(/^\d{5,6}$/).required().messages({
      'string.pattern.base': 'Please provide a valid zip code',
      'any.required': 'Zip code is required'
    }),
    country: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Country must be at least 2 characters long',
      'any.required': 'Country is required'
    }),
    type: Joi.string().valid('home', 'work', 'other').default('home')
  }),

  cartItem: Joi.object({
    productId: Joi.string().required().messages({
      'any.required': 'Product ID is required'
    }),
    quantity: Joi.number().integer().min(1).max(10).default(1).messages({
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Maximum quantity is 10 per item'
    })
  })
};

module.exports = { validate, schemas };