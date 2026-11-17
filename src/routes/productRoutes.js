const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getLowStockAlerts,
  getInventorySummary,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct
} = require('../controllers/productController');

// Base routes for /api/products
router.route('/')
  .post(createProduct)
  .get(getProducts);

// Aggregation & Reporting routes (must precede /:id)
router.get('/low-stock', getLowStockAlerts);
router.get('/summary', getInventorySummary);

// Single product resource routes
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

// Stock adjustment route
router.patch('/:id/stock', adjustStock);

module.exports = router;
