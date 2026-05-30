const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const clearDatabase = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error('MONGO_URI is missing in .env file!');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully.');

    console.log('Clearing all collections...');
    
    const cartResult = await Cart.deleteMany({});
    console.log(`Deleted ${cartResult.deletedCount} Cart records.`);

    const orderResult = await Order.deleteMany({});
    console.log(`Deleted ${orderResult.deletedCount} Order records.`);

    const productResult = await Product.deleteMany({});
    console.log(`Deleted ${productResult.deletedCount} Product records.`);

    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} User records.`);

    console.log('Database successfully cleared!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error.message);
    process.exit(1);
  }
};

clearDatabase();
