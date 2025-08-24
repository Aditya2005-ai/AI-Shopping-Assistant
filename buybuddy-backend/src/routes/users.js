const express = require('express');
const router = express.Router(); // <-- add this
const { authenticateToken } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  deleteUserAccount
} = require('../controllers/userController');

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.get('/stats', authenticateToken, getUserStats);
router.delete('/account', authenticateToken, deleteUserAccount);

module.exports = router;
