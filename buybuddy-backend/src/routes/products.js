const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  analyzeProduct,
  saveProduct,
  getSavedProducts,
  deleteProduct
} = require('../controllers/productController');

// Analyze product from URL
router.post('/analyze', authenticateToken, analyzeProduct);

// Save product to user's collection
router.post('/save', authenticateToken, saveProduct);

// Get user's saved products
router.get('/saved', authenticateToken, getSavedProducts);

// Delete saved product
router.delete('/saved/:productId', authenticateToken, deleteProduct);

module.exports = router;
