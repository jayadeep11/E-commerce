const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  gender: { 
    type: String, 
    required: true, 
    enum: ['Men', 'Women', 'Kids', 'Unisex'],
    default: 'Unisex'
  },
  price: { type: Number, required: true, default: 0 }, 
  mrp: { type: Number, required: true, default: 0 },   
  image: { type: String, required: true },            
  images: [{ type: String }],                         
  reviews: [reviewSchema],
  countInStock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
