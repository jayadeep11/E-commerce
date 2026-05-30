const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  addOrderItems,
  getMyOrders,
  getMyStats,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
} = require('../controllers/orderController');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/mystats', protect, getMyStats);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
