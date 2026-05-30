const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Product = require('./models/Product');

const defaultProducts = [
  // --- SHIRTS ---
  {
    name: "Classic Linen Button-Down",
    brand: "Signature",
    category: "Shirts",
    gender: "Men",
    price: 49,
    mrp: 65,
    description: "Breathable pure linen casual shirt, perfect for warm summers. Relaxed fit featuring premium wooden buttons.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    countInStock: 25,
    isFeatured: true,
  },
  {
    name: "Oxford Cotton Formal Shirt",
    brand: "TailorFit",
    category: "Shirts",
    gender: "Men",
    price: 59,
    mrp: 75,
    description: "Crisp premium Oxford cotton shirt. Double-stitched seams and button-down collar for formal or semi-formal occasions.",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800",
    countInStock: 30,
    isFeatured: false,
  },
  {
    name: "Denim Utility Shirt",
    brand: "Indigo",
    category: "Shirts",
    gender: "Unisex",
    price: 55,
    mrp: 70,
    description: "Durable stonewashed denim shirt with double breast pockets. Vintage aesthetic that ages beautifully with time.",
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800",
    countInStock: 15,
    isFeatured: true,
  },
  {
    name: "Classic Plaid Flannel",
    brand: "Timberline",
    category: "Shirts",
    gender: "Unisex",
    price: 45,
    mrp: 55,
    description: "Soft brushed cotton flannel in a timeless red-black buffalo plaid check pattern. Comfortable and exceptionally warm.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800",
    countInStock: 22,
    isFeatured: false,
  },

  // --- TSHIRTS ---
  {
    name: "Premium Heavyweight Cotton Tee",
    brand: "CoreBasics",
    category: "Tshirts",
    gender: "Unisex",
    price: 25,
    mrp: 35,
    description: "260GSM ultra-soft pre-shrunk cotton t-shirt with a boxy modern drape and robust ribbed neckline.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
    countInStock: 50,
    isFeatured: true,
  },
  {
    name: "Pique Cotton Polo",
    brand: "Athletics",
    category: "Tshirts",
    gender: "Men",
    price: 35,
    mrp: 45,
    description: "Tailored athletic fit polo shirt made of breathable waffle-pique cotton mesh. Perfect for golf or casual Fridays.",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800",
    countInStock: 40,
    isFeatured: false,
  },
  {
    name: "Retro Graphic Streetwear Tee",
    brand: "NeonCity",
    category: "Tshirts",
    gender: "Women",
    price: 29,
    mrp: 40,
    description: "Oversized fit vintage-washed cotton graphic tee featuring high-density screenprinted retro cyberpunk graphic details.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
    countInStock: 35,
    isFeatured: true,
  },

  // --- ACCESSORIES ---
  {
    name: "Minimalist Leather Wallet",
    brand: "Hide & Sleek",
    category: "Accessories",
    gender: "Unisex",
    price: 39,
    mrp: 50,
    description: "Full-grain vegetable-tanned leather wallet with RFID blocking technology. Slim profile with 6 card slots.",
    image: "https://images.unsplash.com/photo-1627124765135-56c2f779411d?w=800",
    countInStock: 60,
    isFeatured: true,
  },
  {
    name: "Classic Steel Chronograph Watch",
    brand: "Chronos",
    category: "Accessories",
    gender: "Men",
    price: 149,
    mrp: 199,
    description: "Water-resistant precision timepiece with polished stainless steel chassis, black dial, and sapphire glass crystal cover.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    countInStock: 12,
    isFeatured: true,
  },
  {
    name: "Premium Acetate Sunglasses",
    brand: "Vista",
    category: "Accessories",
    gender: "Unisex",
    price: 79,
    mrp: 110,
    description: "Polarized UV400 protective sunglasses constructed from lightweight bio-acetate frame. Hand-polished tortoiseshell finish.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    countInStock: 25,
    isFeatured: false,
  },
  {
    name: "Waterproof Travel Backpack",
    brand: "Nomad",
    category: "Accessories",
    gender: "Unisex",
    price: 89,
    mrp: 120,
    description: "Heavy-duty waterproof matte nylon travel backpack with secure laptop sleeve, luggage sleeve, and dynamic layout folders.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    countInStock: 18,
    isFeatured: false,
  },

  // --- PANTS ---
  {
    name: "Slim-Fit Comfort Chinos",
    brand: "CoreBasics",
    category: "Pants",
    gender: "Men",
    price: 49,
    mrp: 65,
    description: "Sleek chinos engineered with lightweight breathable stretch cotton. Double welt rear pockets and robust YKK zippers.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
    countInStock: 20,
    isFeatured: true,
  },
  {
    name: "Stonewash Stretch Jeans",
    brand: "Indigo",
    category: "Pants",
    gender: "Unisex",
    price: 59,
    mrp: 80,
    description: "Durable selvage denim pants treated with custom stonewash tinting. Designed with 2% elastane for seamless flex.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    countInStock: 28,
    isFeatured: true,
  },
  {
    name: "Relaxed Linen Trousers",
    brand: "Signature",
    category: "Pants",
    gender: "Women",
    price: 45,
    mrp: 60,
    description: "Ultra-comfy linen-blend trousers with drawstring elastic waistband and side-seam pockets. Relaxed, breezy aesthetic.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
    countInStock: 15,
    isFeatured: false,
  },

  // --- FOOTWEAR ---
  {
    name: "Lightweight Runner Sneakers",
    brand: "Athletics",
    category: "Footwear",
    gender: "Unisex",
    price: 89,
    mrp: 120,
    description: "Responsive athletic running shoes. Features shock-absorbing high-density midsole foam and breathable mesh upper stitching.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    countInStock: 15,
    isFeatured: true,
  },
  {
    name: "Classic Minimal White Sneaker",
    brand: "Signature",
    category: "Footwear",
    gender: "Unisex",
    price: 99,
    mrp: 140,
    description: "Premium smooth full-grain leather white sneakers. Low-profile silhouette with stitched rubber cupsoles.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
    countInStock: 20,
    isFeatured: true,
  },
  {
    name: "Suede Chelsea Boots",
    brand: "Heritage",
    category: "Footwear",
    gender: "Men",
    price: 129,
    mrp: 180,
    description: "Handcrafted water-resistant Italian split-suede Chelsea boots with elastic side gores and rugged crepe outsoles.",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800",
    countInStock: 10,
    isFeatured: false,
  }
];

const seedProducts = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error('MONGO_URI is missing in .env!');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully.');

    // 1. Ensure an Admin user exists
    let adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('No Admin user found. Creating seed Admin User...');
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin12345", // Will be automatically hashed by User schema pre-save hook
        phone: "1234567890",
        isAdmin: true,
        isVerified: true
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Using existing Admin User:', adminUser.email);
    }

    // 2. Insert Products avoiding duplicates (check slug)
    console.log('Seeding products...');
    let seededCount = 0;
    let skippedCount = 0;

    for (const prodData of defaultProducts) {
      // Generate unique slug
      const slug = prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + prodData.brand.toLowerCase();

      // Check if product with this slug already exists
      const exists = await Product.findOne({ slug });
      if (exists) {
        skippedCount++;
        continue;
      }

      await Product.create({
        ...prodData,
        slug,
        user: adminUser._id,
        mrp: prodData.mrp || prodData.price,
        gender: prodData.gender || 'Unisex'
      });
      seededCount++;
    }

    console.log(`Seeding completed!`);
    console.log(`- Seeded newly: ${seededCount} products.`);
    console.log(`- Skipped (already exist): ${skippedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedProducts();
