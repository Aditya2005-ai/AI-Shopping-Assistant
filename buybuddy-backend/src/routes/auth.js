// src/routes/auth.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  verifyToken,
  refreshToken
} = require('../controllers/authController');

// Register new user
router.post('/register', registerUser);

// Login user  
router.post('/login', loginUser);

// Verify token
router.post('/verify', authenticateToken, verifyToken);

// Refresh token
router.post('/refresh', refreshToken);

module.exports = router;

// ===================================
// src/controllers/authController.js
// ===================================
const { auth, db } = require('../config/firebase');
const { validateEmail, validatePassword } = require('../utils/validators');

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name.trim()
    });

    // Store user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        emailNotifications: true,
        priceAlerts: true,
        theme: 'light'
      },
      isActive: true,
      lastLoginAt: null
    });

    console.log(`👤 New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: userRecord.uid,
        email,
        name: name.trim()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    if (error.code === 'auth/weak-password') {
      return res.status(400).json({
        success: false,
        message: 'Password is too weak'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, idToken } = req.body;

    let user;
    
    // If idToken is provided (from frontend Firebase Auth)
    if (idToken) {
      const decodedToken = await auth.verifyIdToken(idToken);
      user = await auth.getUser(decodedToken.uid);
    } else if (email) {
      // Fallback: get user by email (password verification would be done on frontend)
      user = await auth.getUserByEmail(email);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email or ID token required'
      });
    }
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    // Update last login
    await db.collection('users').doc(user.uid).update({
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`🔐 User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        uid: user.uid,
        email: user.email,
        name: userData?.name || user.displayName,
        avatar: userData?.avatar || null,
        preferences: userData?.preferences || {},
        lastLoginAt: userData?.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    // Token already verified in middleware
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User data not found'
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        uid: req.user.uid,
        email: req.user.email,
        name: userData?.name || req.user.name,
        avatar: userData?.avatar || null,
        preferences: userData?.preferences || {},
        isActive: userData?.isActive !== false,
        createdAt: userData?.createdAt,
        lastLoginAt: userData?.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token and create new custom token if needed
    // Note: Firebase handles most token refresh automatically on client side
    
    res.json({
      success: true,
      message: 'Token refresh handled by Firebase SDK',
      data: {
        message: 'Use Firebase SDK refreshToken method on client side'
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Update user's last activity
    await db.collection('users').doc(userId).update({
      lastLogoutAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`🚪 User logged out: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  refreshToken,
  logoutUser
};

// ===================================
// src/routes/users.js
// ===================================
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  deleteUserAccount
} = require('../controllers/userController');

// Get user profile
router.get('/profile', authenticateToken, getUserProfile);

// Update user profile
router.put('/profile', authenticateToken, updateUserProfile);

// Get user stats
router.get('/stats', authenticateToken, getUserStats);

// Delete user account
router.delete('/account', authenticateToken, deleteUserAccount);

module.exports = router;

// ===================================
// src/controllers/userController.js
// ===================================
const { db, auth } = require('../config/firebase');
const { validateUrl } = require('../utils/validators');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    
    // Remove sensitive data
    const { password, ...safeUserData } = userData;
    
    res.json({
      success: true,
      data: safeUserData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, preferences, avatar, bio } = req.body;

    const updateData = {
      updatedAt: new Date().toISOString()
    };

    // Validate and update name
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Name must be a non-empty string'
        });
      }
      updateData.name = name.trim();
    }

    // Validate and update preferences
    if (preferences !== undefined) {
      if (typeof preferences !== 'object' || preferences === null) {
        return res.status(400).json({
          success: false,
          message: 'Preferences must be an object'
        });
      }
      updateData.preferences = preferences;
    }

    // Validate and update avatar URL
    if (avatar !== undefined) {
      if (avatar !== null && !validateUrl(avatar)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid avatar URL'
        });
      }
      updateData.avatar = avatar;
    }

    // Update bio
    if (bio !== undefined) {
      if (typeof bio !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Bio must be a string'
        });
      }
      updateData.bio = bio.trim();
    }

    await db.collection('users').doc(userId).update(updateData);

    // Also update Firebase Auth display name if name was changed
    if (updateData.name) {
      await auth.updateUser(userId, {
        displayName: updateData.name
      });
    }

    console.log(`👤 Profile updated for user: ${userId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updateData
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 'not-found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get saved products count
    const savedProductsSnapshot = await db.collection('savedProducts')
      .where('userId', '==', userId)
      .get();

    // Get user's searches count (if you have a searches collection)
    const searchesSnapshot = await db.collection('searches')
      .where('userId', '==', userId)
      .get();

    // Get user's alerts count
    const alertsSnapshot = await db.collection('priceAlerts')
      .where('userId', '==', userId)
      .get();

    const stats = {
      savedProductsCount: savedProductsSnapshot.size,
      searchesCount: searchesSnapshot.size,
      activeAlertsCount: alertsSnapshot.size,
      joinDate: null,
      lastActivity: new Date().toISOString()
    };

    // Get user join date and other info
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      stats.joinDate = userData.createdAt;
      stats.lastLoginAt = userData.lastLoginAt;
      stats.lastLogoutAt = userData.lastLogoutAt;
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user stats'
    });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { confirmPassword } = req.body;

    // Note: Password confirmation would typically be handled on frontend
    // This is a simplified version

    // Delete user data from Firestore
    const batch = db.batch();
    
    // Delete user document
    batch.delete(db.collection('users').doc(userId));
    
    // Delete user's saved products
    const savedProductsSnapshot = await db.collection('savedProducts')
      .where('userId', '==', userId)
      .get();
    
    savedProductsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user's searches
    const searchesSnapshot = await db.collection('searches')
      .where('userId', '==', userId)
      .get();
    
    searchesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user's price alerts
    const alertsSnapshot = await db.collection('priceAlerts')
      .where('userId', '==', userId)
      .get();
    
    alertsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete user from Firebase Auth
    await auth.deleteUser(userId);

    console.log(`🗑️ User account deleted: ${userId}`);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  deleteUserAccount
};

// ===================================
// src/middleware/auth.js
// ===================================
const { auth } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

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
      name: decodedToken.name,
      emailVerified: decodedToken.email_verified
    };

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Token revoked'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        emailVerified: decodedToken.email_verified
      };
    }

    next();

  } catch (error) {
    // Continue without authentication if token is invalid
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};

// ===================================
// src/utils/validators.js
// ===================================
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
};

const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validatePassword = (password) => {
  return password && typeof password === 'string' && password.length >= 6;
};

const validateName = (name) => {
  return name && typeof name === 'string' && name.trim().length > 0;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  validateEmail,
  validateUrl,
  validatePassword,
  validateName,
  sanitizeInput
};

// ===================================
// src/config/firebase.js
// ===================================
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json'); // Your Firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = {
  auth,
  db,
  admin
};

// ===================================
// Usage in main app.js
// ===================================
/*
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/