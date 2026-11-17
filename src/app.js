const express = require('express');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parser middleware
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Inventory and Data Management System API',
    endpoints: {
      products: '/api/products',
      lowStock: '/api/products/low-stock',
      summary: '/api/products/summary'
    }
  });
});

// Mount Product Routes
app.use('/api/products', productRoutes);

// 404 Fallback for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
