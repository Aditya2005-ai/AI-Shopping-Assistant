// src/config/firebase.js
const admin = require('firebase-admin');

// Firebase service account configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBD26UPdmEvuxyXadzOCu-RnIAB5TGx_lA",
  authDomain: "pricepredictor-bfe9c.firebaseapp.com",
  projectId: "pricepredictor-bfe9c",
  storageBucket: "pricepredictor-bfe9c.firebasestorage.app",
  messagingSenderId: "900343827213",
  appId: "1:900343827213:web:381bf7240ef58e3fb77e44",
  measurementId: "G-XXNG19BQ6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// Configure Firestore settings
db.settings({
  timestampsInSnapshots: true
});

module.exports = { 
  admin, 
  db, 
  auth, 
  storage 
};

// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

module.exports = cloudinary;

// src/utils/email.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to BuyBuddy!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to BuyBuddy, ${name}!</h1>
        <p style="font-size: 16px; color: #666;">Thank you for joining our community. Start exploring amazing products!</p>
        <a href="${process.env.FRONTEND_URL}/products" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
           Shop Now
        </a>
        <p style="color: #999; font-size: 14px;">Happy shopping!</p>
      </div>
    `
  }),

  orderConfirmation: (orderDetails) => ({
    subject: `Order Confirmation - #${orderDetails.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmed!</h1>
        <p style="font-size: 16px; color: #666;">Thank you for your order. Your order #${orderDetails.orderId} has been confirmed.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Total:</strong> $${orderDetails.total}</p>
        </div>
        <p style="color: #666;">We'll send you updates about your order status.</p>
      </div>
    `
  }),

  passwordReset: (resetLink) => ({
    subject: 'Reset Your Password - BuyBuddy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p style="font-size: 16px; color: #666;">Click the link below to reset your password:</p>
        <a href="${resetLink}" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
           Reset Password
        </a>
        <p style="color: #999; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const emailContent = emailTemplates[template](data);
    
    const mailOptions = {
      from: `"BuyBuddy" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };

// src/utils/helpers.js
const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Calculate discount
const calculateDiscount = (originalPrice, discountPercentage) => {
  const discount = (originalPrice * discountPercentage) / 100;
  return {
    discount,
    finalPrice: originalPrice - discount
  };
};

// Generate SKU
const generateSKU = (category, name) => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const nameCode = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${categoryCode}${nameCode}${randomCode}`;
};

// Pagination helper
const paginate = (page = 1, limit = 10) => {
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);
  const skip = (currentPage - 1) * itemsPerPage;
  
  return {
    skip,
    limit: itemsPerPage,
    page: currentPage
  };
};

// Search query builder
const buildSearchQuery = (searchTerm) => {
  if (!searchTerm) return {};
  
  const searchRegex = new RegExp(searchTerm, 'i');
  return {
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
      { brand: searchRegex },
      { tags: searchRegex }
    ]
  };
};

// Generate Order ID
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD${timestamp}${random}`;
};

// Calculate shipping cost
const calculateShipping = (total, weight = 0) => {
  if (total > 100) return 0; // Free shipping over $100
  if (weight > 5) return 20; // Heavy items
  return 10; // Standard shipping
};

module.exports = {
  generateRandomString,
  formatCurrency,
  calculateDiscount,
  generateSKU,
  paginate,
  buildSearchQuery,
  generateOrderId,
  calculateShipping
};