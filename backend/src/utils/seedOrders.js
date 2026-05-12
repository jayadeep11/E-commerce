const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'London', 'Paris', 'Tokyo', 'Berlin', 'Toronto'];
const countries = ['USA', 'UK', 'France', 'Japan', 'Germany', 'Canada'];
const postalCodes = ['10001', '90210', '60601', '77001', '33101', 'SW1A', '75001', '100-0001'];

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne() || await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const products = await Product.find();

    if (products.length === 0) {
      console.error('No products found. Run seedClothing.js first.');
      process.exit(1);
    }

    const orders = [];

    for (let i = 0; i < 100; i++) {
      // Randomly pick 1-3 products for this order
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let itemsPrice = 0;

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        
        orderItems.push({
          name: product.name,
          qty,
          image: product.image,
          price: product.price,
          product: product._id
        });
        
        itemsPrice += product.price * qty;
      }

      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      const isPaid = Math.random() > 0.2; // 80% chance it's paid
      const isDelivered = isPaid && Math.random() > 0.3; // 70% chance of being delivered if paid

      orders.push({
        user: user._id,
        orderItems,
        shippingAddress: {
          address: `${Math.floor(Math.random() * 999) + 1} Main St`,
          city: cities[Math.floor(Math.random() * cities.length)],
          postalCode: postalCodes[Math.floor(Math.random() * postalCodes.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
        },
        paymentMethod: 'PayPal',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt: isPaid ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)) : null,
        isDelivered,
        deliveredAt: isDelivered ? new Date() : null,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Up to 4 months ago
      });
    }

    await Order.deleteMany();
    await Order.insertMany(orders);

    console.log('100 Order Examples Generated Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with seeding orders:', error);
    process.exit(1);
  }
};

seedOrders();
