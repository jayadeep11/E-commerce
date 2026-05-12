const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

// Pool of 50+ Unique Accessory Images from Unsplash
const accessoryImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584917765829-d73b58ff200c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1624222247344-550fbad0647a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576871333020-2219714a953a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512331283953-19967202267a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511499767390-91f19760a0ac?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515562141224-7a52ef2ce588?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598533023411-ca4e23aa5042?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511402339625-56e26829bc50?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1617137968427-83c394297941?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1575410223722-df3848f62c2f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1588094749432-bc1951552554?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1616748494672-69024f9232ed?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520006403991-3c9793c77216?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515562141224-7a52ef2ce588?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1521120413309-42e7eada0332?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511402339625-56e26829bc50?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509112756314-34a0badb29d4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524805444758-09914d860542?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1491633582673-491621587b1c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
];

const clothingProducts = [
  // ACCESSORIES - MEN
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
    name: 'Minimalist Bifold Wallet',
    brand: 'Urban Aura',
    gender: 'Men',
    description: 'Slim leather wallet with RFID protection. Designed for the modern professional.',
    category: 'Accessories',
    price: 35.00,
    mrp: 55.00
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
    name: 'Sterling Silver Cufflinks',
    brand: 'Formal Edge',
    gender: 'Men',
    description: 'Hand-finished silver cufflinks for the ultimate formal statement.',
    category: 'Accessories',
    price: 85.00,
    mrp: 120.00
  },

  // ACCESSORIES - WOMEN
  {
    name: '18K Gold Plated Necklace',
    brand: 'Luna Muse',
    gender: 'Women',
    description: 'Elegant layered gold necklace. Adds a touch of luxury to any outfit.',
    category: 'Accessories',
    price: 75.00,
    mrp: 120.00
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
    name: 'Silk Patterned Scarf',
    brand: 'Luna Muse',
    gender: 'Women',
    description: '100% pure silk scarf with hand-drawn floral patterns. Versatile and luxurious.',
    category: 'Accessories',
    price: 55.00,
    mrp: 85.00
  },
  {
    name: 'Velvet Clutch Bag',
    brand: 'Luna Muse',
    gender: 'Women',
    description: 'Sophisticated velvet clutch for gala evenings and formal events.',
    category: 'Accessories',
    price: 145.00,
    mrp: 210.00
  },

  // ACCESSORIES - KIDS
  {
    name: 'Adventure School Backpack',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Ergonomic backpack with multiple compartments and reflective safety patches.',
    category: 'Accessories',
    price: 39.00,
    mrp: 55.00
  },
  {
    name: 'Superhero LED Digital Watch',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Fun, waterproof digital watch with colorful LED lights and character graphics.',
    category: 'Accessories',
    price: 25.00,
    mrp: 35.00
  },
  {
    name: 'Playful Pom-Pom Beanie',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Soft knit beanie with a fluffy pom-pom. Keeps them warm and stylish in winter.',
    category: 'Accessories',
    price: 18.00,
    mrp: 25.00
  },
  {
    name: 'Animal Ears Headband',
    brand: 'Tiny Trendsetters',
    gender: 'Kids',
    description: 'Adorable plush headband for a playful look.',
    category: 'Accessories',
    price: 12.00,
    mrp: 18.00
  },

  // ACCESSORIES - UNISEX
  {
    name: 'Urban Canvas Tote Bag',
    brand: 'Urban Aura',
    gender: 'Unisex',
    description: 'Heavyweight canvas tote with reinforced handles. The ultimate eco-friendly carry-all.',
    category: 'Accessories',
    price: 25.00,
    mrp: 40.00
  },
  {
    name: 'Classic Knit Beanie',
    brand: 'Urban Aura',
    gender: 'Unisex',
    description: 'Standard fit rib-knit beanie. A versatile essential for any cold-weather look.',
    category: 'Accessories',
    price: 15.00,
    mrp: 25.00
  },
  {
    name: 'Leather Laptop Portfolio',
    brand: 'Volt Armor',
    gender: 'Unisex',
    description: 'Sleek leather portfolio designed for 13-inch laptops. Tech protection meet high-end style.',
    category: 'Accessories',
    price: 120.00,
    mrp: 180.00,
    isFeatured: true
  },
  {
    name: 'Anti-Blue Light Glasses',
    brand: 'Volt Armor',
    gender: 'Unisex',
    description: 'Stylish frames with blue light filtering lenses for digital comfort.',
    category: 'Accessories',
    price: 45.00,
    mrp: 65.00
  }
];

const seedClothing = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(MONGO_URI);
    
    console.log('\n--- 👔 SEEDING KORE ACCESSORIES SHOWROOM 👔 ---');

    let admin = await User.findOne({ isAdmin: true });
    
    if (!admin) {
      admin = await User.create({
        name: 'KORE Admin',
        email: 'admin@lookbetter.com',
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
      
      const priceVariation = 0.95 + Math.random() * 0.1; // 95% to 105%
      const price = parseFloat((template.price * priceVariation).toFixed(2));
      const mrp = parseFloat((template.mrp * priceVariation).toFixed(2));
      
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Assign UNIQUE Image from the pool
      const imageUrl = accessoryImages[i % accessoryImages.length];

      massiveProducts.push({
        ...template,
        name,
        slug,
        image: imageUrl,
        images: [imageUrl], // Single gallery image for now
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
    console.log(`${massiveProducts.length} Unique Accessories with UNIQUE Images successfully added! 💎`);
    console.log('Visual Engine: 100 items are now LIVE. 🚀');
    process.exit();
  } catch (error) {
    console.error('Error with seeding accessories:', error);
    process.exit(1);
  }
};

seedClothing();
