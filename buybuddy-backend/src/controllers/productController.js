const { scrapeProduct } = require('../services/scraperService');
const { getAIAnalysis } = require('../services/aiService');
const { db } = require('../config/firebase');
const { validateUrl } = require('../utils/validators');

// Analyze product URL
const analyzeProduct = async (req, res) => {
  try {
    const { url } = req.body;
    if (!validateUrl(url)) {
      return res.status(400).json({ success: false, message: 'Invalid URL provided' });
    }

    const productData = await scrapeProduct(url);
    if (!productData) {
      return res.status(400).json({ success: false, message: 'Could not extract product information' });
    }

    const aiAnalysis = await getAIAnalysis(productData);
    const result = { ...productData, aiAnalysis, analyzedAt: new Date().toISOString(), sourceUrl: url };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Product analysis error:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze product' });
  }
};

// Save product
const saveProduct = async (req, res) => {
  try {
    const { productData } = req.body;
    const userId = req.user.uid;

    const savedProduct = {
      ...productData,
      userId,
      savedAt: new Date().toISOString(),
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    await db.collection('savedProducts').doc(savedProduct.id).set(savedProduct);
    res.json({ success: true, data: savedProduct, message: 'Product saved successfully' });
  } catch (error) {
    console.error('Save product error:', error);
    res.status(500).json({ success: false, message: 'Failed to save product' });
  }
};

// Get saved products
const getSavedProducts = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.collection('savedProducts')
      .where('userId', '==', userId)
      .orderBy('savedAt', 'desc')
      .get();

    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: products, total: products.length });
  } catch (error) {
    console.error('Get saved products error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve saved products' });
  }
};

// Delete saved product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('savedProducts').doc(productId).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Product not found' });
    if (doc.data().userId !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });

    await db.collection('savedProducts').doc(productId).delete();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

module.exports = { analyzeProduct, saveProduct, getSavedProducts, deleteProduct };
