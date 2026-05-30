const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/razorpayController');

router.post('/order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
