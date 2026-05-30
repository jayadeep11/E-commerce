const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  updateCart,
  clearCart,
} = require('../controllers/cartController');

router.route('/')
  .get(protect, getCart)
  .post(protect, updateCart)
  .delete(protect, clearCart);

module.exports = router;
