const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');



router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, brand, price, mrp, description, image, category, gender, countInStock } = req.body;

    // Generate a simple slug from the name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const product = new Product({
      name,
      slug,
      brand,
      price,
      mrp: mrp || price,
      user: req.user._id,
      image,
      category,
      gender: gender || 'Unisex',
      countInStock,
      description,
    });

    const createdProduct = await product.save();
    
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
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
    const { name, brand, price, mrp, description, image, category, gender, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.brand = brand || product.brand;
      product.price = price !== undefined ? price : product.price;
      product.mrp = mrp !== undefined ? mrp : product.mrp;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.gender = gender || product.gender;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

      const updatedProduct = await product.save();
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
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
