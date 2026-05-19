const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const { redisClient } = require('../config/redis');




router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;

    const product = new Product({
      name,
      price,
      user: req.user._id,
      image,
      category,
      countInStock,
      description,
    });

    const createdProduct = await product.save();
    
    try {
      await redisClient.del('products');
    } catch (err) {
      console.error('Redis error on product creation:', err);
    }
    
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/', async (req, res) => {
  try {
    try {
      const cachedProducts = await redisClient.get('products');
      if (cachedProducts) {
        return res.json(cachedProducts);
      }
    } catch (err) {
      console.error('Redis GET error:', err);
    }

    const products = await Product.find({});
    
    try {
      await redisClient.set('products', products, { ex: 3600 });
    } catch (err) {
      console.error('Redis SET error:', err);
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/:id', async (req, res) => {
  try {
    try {
      const cachedProduct = await redisClient.get(`product:${req.params.id}`);
      if (cachedProduct) {
        return res.json(cachedProduct);
      }
    } catch (err) {
      console.error('Redis GET product error:', err);
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      try {
        await redisClient.set(`product:${req.params.id}`, product, { ex: 3600 });
      } catch (err) {
        console.error('Redis SET product error:', err);
      }
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      try {
        await redisClient.del('products');
        await redisClient.del(`product:${req.params.id}`);
      } catch (err) {
        console.error('Redis DEL error:', err);
      }
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      try {
        await redisClient.del('products');
        await redisClient.del(`product:${req.params.id}`);
      } catch (err) {
        console.error('Redis DEL error:', err);
      }
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      try {
        await redisClient.del('products');
        await redisClient.del(`product:${req.params.id}`);
      } catch (err) {
        console.error('Redis DEL error:', err);
      }
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
