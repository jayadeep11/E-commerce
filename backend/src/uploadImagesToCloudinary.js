const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Product = require('./models/Product');

const uploadImagesToCloudinary = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error('MONGO_URI is missing in .env!');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully.');

    console.log('Fetching products to update...');
    const products = await Product.find({});
    console.log(`Found ${products.length} products to process.`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      // Check if image is already a Cloudinary image
      if (product.image && product.image.includes('res.cloudinary.com')) {
        console.log(`[-] Skipping "${product.name}" - Already hosted on Cloudinary.`);
        skippedCount++;
        continue;
      }

      console.log(`[+] Uploading image for "${product.name}" from: ${product.image}`);
      try {
        const uploadResponse = await cloudinary.uploader.upload(product.image, {
          folder: 'kore_ecommerce',
        });
        
        product.image = uploadResponse.secure_url;
        await product.save();
        
        console.log(`[✓] Successfully updated: "${product.name}" with Cloudinary URL.`);
        updatedCount++;
      } catch (uploadError) {
        console.error(`[✗] Failed to upload image for "${product.name}":`, uploadError.message);
      }
    }

    console.log('Process finished!');
    console.log(`- Uploaded & Updated: ${updatedCount} products.`);
    console.log(`- Skipped: ${skippedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Database connection or process error:', error.message);
    process.exit(1);
  }
};

uploadImagesToCloudinary();
