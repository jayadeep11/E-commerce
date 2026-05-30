const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');



const pendingUsers = new Map();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};



router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: 'Account not verified. Please check your email for the verification code.',
        requiresVerification: true,
        email: user.email
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePic: user.profilePic,
      addresses: user.addresses || [],
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});



router.post('/', async (req, res) => {
  try {
    const { name, email, password, phone, isAdmin } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      isAdmin: isAdmin === true,
      isVerified: true
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePic: user.profilePic,
      addresses: user.addresses || [],
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pendingData = pendingUsers.get(email);

    if (!pendingData || pendingData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const user = await User.create({
      name: pendingData.name,
      email: pendingData.email,
      password: pendingData.password,
      phone: pendingData.phone,
      isAdmin: pendingData.isAdmin,
      isVerified: true
    });

    pendingUsers.delete(email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePic: user.profilePic,
      addresses: [],
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profilePic, addresses: user.addresses || [], isAdmin: user.isAdmin });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});



router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, profilePic, password } = req.body;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (password) user.password = password;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profilePic: updatedUser.profilePic,
      addresses: updatedUser.addresses || [],
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





router.post('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { label, address, city, postalCode, country, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses.push({ label, address, city, postalCode, country, isDefault });
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.put('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (address) {
      const { label, address: addr, city, postalCode, country, isDefault } = req.body;
      
      if (isDefault) {
        user.addresses.forEach(a => a.isDefault = false);
      }

      address.label = label || address.label;
      address.address = addr || address.address;
      address.city = city || address.city;
      address.postalCode = postalCode || address.postalCode;
      address.country = country || address.country;
      address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.put('/addresses/:id/default', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach(a => {
      a.isDefault = (a._id.toString() === req.params.id);
    });
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', protect, admin, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

module.exports = router;
