const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cloudinary = require('cloudinary').v2;

dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Product = require('./models/Product');

const fixWallet = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);

    const wallet = await Product.findOne({ name: "Minimalist Leather Wallet" });
    if (wallet) {
      console.log('Found wallet in database. Updating photo source...');
      const newUnsplashUrl = "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=800";
      
      console.log('Uploading new wallet image to Cloudinary...');
      const uploadResponse = await cloudinary.uploader.upload(newUnsplashUrl, {
        folder: 'kore_ecommerce',
      });

      wallet.image = uploadResponse.secure_url;
      await wallet.save();
      console.log('Wallet successfully updated with new Cloudinary URL:', wallet.image);
    } else {
      console.log('Wallet not found in database.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error correcting wallet:', error.message);
    process.exit(1);
  }
};

fixWallet();
