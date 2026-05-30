const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    if (cart) {
      res.json(cart);
    } else {
      res.json({ cartItems: [] });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update user cart
// @route   POST /api/cart
// @access  Private
const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.cartItems = cartItems;
      const updatedCart = await cart.save();
      res.json(updatedCart);
    } else {
      const newCart = await Cart.create({
        user: req.user._id,
        cartItems
      });
      res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/Clear user cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  updateCart,
  clearCart,
};
