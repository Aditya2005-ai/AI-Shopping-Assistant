const express = require('express');
const cors = require('cors');
// const cartRoutes = require('./src/routes/cart'); // aapke cart routes
const productsRoutes = require('./src/routes/products'); // products routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/products', productsRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
