const jwt = require('jsonwebtoken');
const User = require('../models/User');

const pendingUsers = new Map();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
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
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
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
};

// @desc    Verify OTP for registration
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
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
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profilePic, addresses: user.addresses || [], isAdmin: user.isAdmin });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
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
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
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
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
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
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res) => {
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
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

module.exports = {
  loginUser,
  registerUser,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUsers,
  pendingUsers, // Exporting in case helper otp verification maps need shared references
};
