const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');

dotenv.config();

const clearData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(MONGO_URI);

    console.log('\n--- 🔥 TOTAL DATABASE PURGE 🔥 ---');
    
    // Clear Orders
    await Order.deleteMany({});
    console.log('✔ All Orders cleared.');

    // Clear Carts
    await Cart.deleteMany({});
    console.log('✔ All Shopping Carts cleared.');

    // Clear Products
    await Product.deleteMany({});
    console.log('✔ All Products cleared.');

    // Clear Users
    await User.deleteMany({});
    console.log('✔ All Users cleared.');

    console.log('---------------------------------');
    console.log('Your database is now 100% EMPTY and ready for fresh data! 🚀');
    process.exit();
  } catch (error) {
    console.error('Error clearing data:', error.message);
    process.exit(1);
  }
};

clearData();
