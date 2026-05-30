const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('Razorpay keys are missing in .env file');
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create a Razorpay order
// @route   POST /api/razorpay/order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  const { amount, orderId } = req.body;
  console.log('Razorpay Order Request:', { amount, orderId });
  const razorpay = getRazorpayInstance();

  if (!razorpay) {
    return res.status(500).json({ message: 'Razorpay is not configured on the server' });
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${orderId}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    orderId 
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'succeeded',
          update_time: new Date().toISOString(),
        };
        await order.save();
        res.status(200).json({ message: 'Payment verified successfully' });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: 'Invalid signature' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
