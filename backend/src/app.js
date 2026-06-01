const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const razorpayRoutes = require('./routes/razorpayRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();


app.use(cors({
  origin: ['https://kore11.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes); // Backward compatibility: login/register still work on /api/users
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/api/test', (req, res) => {
  res.json({ message: 'API routes are active and working!' });
});

app.get('/', (req, res) => {
  res.send('KORE API is running...');
});


app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
