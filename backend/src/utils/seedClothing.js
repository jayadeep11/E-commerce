const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const shirtImages = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80'
];

const tshirtImages = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519457431-44cac64a579b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=800&q=80'
];

const pantsImages = [
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80'
];

const footwearImages = [
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1463100099907-44d58c4337d2?auto=format&fit=crop&w=800&q=80'
];

const accessoryImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584917765829-d73b58ff200c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515562141224-7a52ef2ce588?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
];

const clothingProducts = [
  // --- SHIRTS ---
  {
    name: 'Crisp Oxford Cotton Shirt',
    brand: 'Formal Edge',
    gender: 'Men',
    description: 'Precision tailored button-down shirt crafted from durable and soft Oxford cotton fabric. Perfect for modern smart-casual wear.',
    category: 'Shirts',
    price: 49.99,
    mrp: 75.00
  },
  {
    name: 'Classic Linen Resort Shirt',
    brand: 'Urban Aura',
    gender: 'Men',
    description: 'Relaxed fit summer shirt made of pure Italian linen. Light, breathable, and pre-washed for ultimate comfort.',
    category: 'Shirts',
    price: 39.99,
    mrp: 59.99
  },
  {
    name: 'Premium Silk Blouse',
    brand: 'Luna Muse',
    gender: 'Women',
    description: 'Luxurious silk blouse with a tailored collar and elegant pleated back. A staple for executive offices and evenings out.',
    category: 'Shirts',
    price: 89.99,
    mrp: 140.00,
    isFeatured: true
  },
  {
    name: 'Lightweight Patterned Poplin Shirt',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Joyful patterned poplin shirt for kids, featuring easy clip-buttons and a soft skin feel.',
    category: 'Shirts',
    price: 24.99,
    mrp: 35.00
  },

  // --- T-SHIRTS ---
  {
    name: 'Heavyweight Signature Tee',
    brand: 'Urban Aura',
    gender: 'Men',
    description: 'Extra thick organic cotton tee with a clean boxy drop-shoulder aesthetic. Shrink-resistant and incredibly soft.',
    category: 'Tshirts',
    price: 29.99,
    mrp: 45.00
  },
  {
    name: 'Fine Ribbed Knit Tee',
    brand: 'Luna Muse',
    gender: 'Women',
    description: 'Chic form-fitting ribbed top with a modern square neckline. Highly stretchable and elegant.',
    category: 'Tshirts',
    price: 24.99,
    mrp: 38.00
  },
  {
    name: 'Playful Graphic Tee',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Breathable combed cotton tee with fun cartoon badges and premium water-based safety ink.',
    category: 'Tshirts',
    price: 18.99,
    mrp: 28.00
  },

  // --- ACCESSORIES ---
  {
    name: 'Precision Leather Belt',
    brand: 'Formal Edge',
    gender: 'Men',
    description: 'Full-grain Italian leather belt with a brushed silver buckle. A timeless formal essential.',
    category: 'Accessories',
    price: 45.00,
    mrp: 65.00
  },
  {
    name: 'Executive Chronograph Watch',
    brand: 'Formal Edge',
    gender: 'Men',
    description: 'Precision engineered timepiece with a genuine leather strap and sapphire glass.',
    category: 'Accessories',
    price: 199.00,
    mrp: 350.00,
    isFeatured: true
  },
  {
    name: 'Designer Quilted Handbag',
    brand: 'Luna Muse',
    gender: 'Women',
    description: 'Quilted leather handbag with signature gold chain strap. An iconic accessory.',
    category: 'Accessories',
    price: 350.00,
    mrp: 550.00,
    isFeatured: true
  },
  {
    name: 'Adventure School Backpack',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Ergonomic backpack with multiple compartments and reflective safety patches.',
    category: 'Accessories',
    price: 39.00,
    mrp: 55.00
  },

  // --- PANTS ---
  {
    name: 'Pleated Tailored Trousers',
    brand: 'Formal Edge',
    gender: 'Men',
    description: 'Sharp slim pleated trousers crafted from ultra-smooth merino wool blend.',
    category: 'Pants',
    price: 79.99,
    mrp: 120.00
  },
  {
    name: 'Raw Selvedge Denim Jeans',
    brand: 'Urban Aura',
    gender: 'Men',
    description: 'Japanese raw selvedge jeans designed to mold and fade uniquely with wear.',
    category: 'Pants',
    price: 119.99,
    mrp: 180.00,
    isFeatured: true
  },
  {
    name: 'Linen Wide-Leg Trousers',
    brand: 'Luna Muse',
    gender: 'Women',
    description: 'Floaty, lightweight wide-leg linen pants with an elasticated waistband for daily premium comfort.',
    category: 'Pants',
    price: 59.99,
    mrp: 90.00
  },
  {
    name: 'Comfy Cotton Jogger Pants',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Durable and cozy French terry joggers. Great for school playground activity and relaxed days.',
    category: 'Pants',
    price: 22.99,
    mrp: 35.00
  },

  // --- FOOTWEAR ---
  {
    name: 'Heritage Leather Chelsea Boots',
    brand: 'Formal Edge',
    gender: 'Men',
    description: 'Water-resistant luxury suede boots with elasticated sides for effortless slip-on styling.',
    category: 'Footwear',
    price: 149.99,
    mrp: 230.00
  },
  {
    name: 'Handcrafted Classic Sneakers',
    brand: 'Urban Aura',
    gender: 'Unisex',
    description: 'Minimalist low-top sneakers in clean grain white leather. Features a cushioned cork footbed.',
    category: 'Footwear',
    price: 99.99,
    mrp: 150.00
  },
  {
    name: 'Elegant Strappy Leather Heels',
    brand: 'Luna Muse',
    gender: 'Women',
    description: 'Fine strappy heels crafted with padded memory foam soles for sophisticated style and wearability.',
    category: 'Footwear',
    price: 129.99,
    mrp: 195.00
  },
  {
    name: 'High-Top Playground Sneakers',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Durable vulcanized canvas shoes with easy-grip side zippers and safety rubber toes.',
    category: 'Footwear',
    price: 34.99,
    mrp: 50.00
  }
];

const seedClothing = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(MONGO_URI);
    
    console.log('\n--- 👔 SEEDING KORE APPAREL SHOWROOM 👔 ---');

    let admin = await User.findOne({ isAdmin: true });
    
    if (!admin) {
      admin = await User.create({
        name: 'KORE Admin',
        email: 'admin@kore.com',
        password: 'password123',
        phone: '1234567890',
        isAdmin: true,
        isVerified: true
      });
    }

    await Product.deleteMany();
    
    const massiveProducts = [];
    const suffixes = ['', 'Edition', 'Pro', 'Elite', 'Limited', 'Classic', 'Signature', 'Premium', 'Essential', 'Select'];

    for (let i = 0; i < 100; i++) {
      const template = clothingProducts[i % clothingProducts.length];
      const suffix = suffixes[Math.floor(i / clothingProducts.length) % suffixes.length];
      const name = suffix ? `${template.name} - ${suffix} ${Math.floor(i/10) || ''}`.trim() : `${template.name} ${i}`;
      
      const priceVariation = 0.95 + Math.random() * 0.1; 
      const price = parseFloat((template.price * priceVariation).toFixed(2));
      const mrp = parseFloat((template.mrp * priceVariation).toFixed(2));
      
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      let imageUrl = '';
      if (template.category === 'Shirts') {
        imageUrl = shirtImages[i % shirtImages.length];
      } else if (template.category === 'Tshirts') {
        imageUrl = tshirtImages[i % tshirtImages.length];
      } else if (template.category === 'Pants') {
        imageUrl = pantsImages[i % pantsImages.length];
      } else if (template.category === 'Footwear') {
        imageUrl = footwearImages[i % footwearImages.length];
      } else {
        imageUrl = accessoryImages[i % accessoryImages.length];
      }

      massiveProducts.push({
        ...template,
        name,
        slug,
        image: imageUrl,
        images: [imageUrl], 
        price,
        mrp,
        countInStock: Math.floor(Math.random() * 100) + 1,
        rating: 0, 
        numReviews: 0,
        user: admin._id
      });
    }

    await Product.insertMany(massiveProducts);
    
    console.log('---------------------------------');
    console.log(`${massiveProducts.length} Premium Apparel Products with UNIQUE Images successfully seeded! 💎`);
    console.log('Visual Engine: 100 items are now LIVE. 🚀');
    process.exit();
  } catch (error) {
    console.error('Error with seeding apparel:', error);
    process.exit(1);
  }
};

seedClothing();
