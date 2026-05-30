const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');



router.post('/', protect, async (req, res) => {
  console.log('Order Creation Request Body:', JSON.stringify(req.body, null, 2));
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: req.body.isPaid || false, 
      paidAt: req.body.isPaid ? Date.now() : null,
    });

    const createdOrder = await order.save();

    
    if (createdOrder.isPaid) {
      for (const item of createdOrder.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          await product.save();
        }
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order Creation Error:', error.message);
    res.status(500).json({ message: 'Error creating order' });
  }
});




router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get user order stats using MongoDB Aggregation
router.get('/mystats', protect, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { user: req.user._id } },
      { 
        $group: { 
          _id: null, 
          orderCount: { $sum: 1 }, 
          totalSpent: { $sum: '$totalPrice' } 
        } 
      }
    ]);

    if (stats.length > 0) {
      res.json({ orderCount: stats[0].orderCount, totalSpent: stats[0].totalSpent });
    } else {
      res.json({ orderCount: 0, totalSpent: 0 });
    }
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Error fetching order stats' });
  }
});




router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});




router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
});




router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status' });
  }
});

module.exports = router;
