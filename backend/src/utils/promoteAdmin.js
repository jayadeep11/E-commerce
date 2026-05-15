const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const promoteUser = async (email) => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(MONGO_URI);

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`Error: User with email "${email}" not found.`);
      process.exit(1);
    }

    user.isAdmin = true;
    user.isVerified = true; 
    await user.save();

    console.log('--- PROMOTION SUCCESSFUL ---');
    console.log(`User: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Status: Promoted to ADMINISTRATOR`);
    process.exit();
  } catch (error) {
    console.error('Error with promotion:', error.message);
    process.exit(1);
  }
};


const emailArg = process.argv[2];

if (!emailArg) {
  console.error('Please provide an email address. Example: node promoteAdmin.js your@email.com');
  process.exit(1);
}

promoteUser(emailArg);
