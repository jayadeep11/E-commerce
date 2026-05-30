const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProductReview,
} = require('../controllers/productController');

router.route('/')
  .post(protect, admin, createProduct)
  .get(getProducts);

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview);

module.exports = router;
