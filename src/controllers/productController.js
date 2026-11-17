const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      supplier,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Filter by exact category
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Filter by supplier
    if (supplier) {
      query.supplier = { $regex: new RegExp(supplier, 'i') };
    }

    // Search by product name or SKU
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortCriteria = { [sortBy]: sortOrder };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      total,
      page: pageNum,
      totalPages,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low-stock alert report (quantity <= reorderLevel)
// @route   GET /api/products/low-stock
// @access  Public
const getLowStockAlerts = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-wise inventory summary using Aggregation
// @route   GET /api/products/summary
// @access  Public
const getInventorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $project: {
          _id: 1,
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: 1,
          avgPrice: { $round: ['$avgPrice', 2] }
        }
      },
      {
        $sort: { totalStockValue: -1 }
      }
    ]);

    res.status(200).json({
      categories: summary.length,
      summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found with id ${req.params.id}`);
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      res.status(404);
      throw new Error(`Product not found with id ${req.params.id}`);
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Safely adjust product stock (restock or sale)
// @route   PATCH /api/products/:id/stock
// @access  Public
const adjustStock = async (req, res, next) => {
  try {
    const { change } = req.body;

    if (change === undefined || typeof change !== 'number' || isNaN(change)) {
      res.status(400);
      throw new Error('Please provide a valid numeric "change" value');
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found with id ${req.params.id}`);
    }

    const updatedQuantity = product.quantity + change;
    if (updatedQuantity < 0) {
      res.status(400);
      throw new Error(
        `Insufficient stock. Current stock is ${product.quantity}, cannot reduce by ${Math.abs(change)}`
      );
    }

    product.quantity = updatedQuantity;
    await product.save();

    res.status(200).json({
      message: 'Stock updated',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found with id ${req.params.id}`);
    }

    res.status(200).json({
      message: 'Product deleted',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getLowStockAlerts,
  getInventorySummary,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct
};
