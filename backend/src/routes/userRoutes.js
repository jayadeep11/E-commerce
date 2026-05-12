const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, phone, password } = req.body;
    
    // DEBUG LOG
    console.log(`[PROFILE UPDATE] Request for ${user.email}: Name=${name}, NewEmail=${email}`);

    const emailChanged = email && email !== user.email;

    if (emailChanged) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'This email is already in use by another account' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

      await sendEmail({
        email: email,
        subject: 'LookBetter - Verify Your New Email',
        message: `Your verification code for changing email is: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #1e293b; text-align: center;">Verify New Email</h2>
            <p style="color: #64748b; font-size: 16px; line-height: 1.6;">You requested to change your email to <b>${email}</b>. Use the code below to verify:</p>
            <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; margin: 30px 0; border-radius: 8px;">
              ${otp}
            </div>
          </div>
        `
      });

      user.otp = otp;
      user.otpExpire = otpExpire;
      await user.save();

      return res.json({
        requiresVerification: true,
        message: 'OTP sent to new email. Please verify to complete the change.',
        pendingEmail: email
      });
    }

    // Update fields
    user.name = name !== undefined ? name : user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    if (password) user.password = password;

    const updatedUser = await user.save();
    console.log(`[PROFILE SUCCESS] Updated user: ${updatedUser.name}`);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error('Profile Update Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Register a new user
// @route   POST /api/users
router.post('/', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendEmail({
          email: email,
          subject: 'LookBetter - Your Verification Code',
          message: `Your verification code is: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #1e293b; text-align: center;">Welcome to LookBetter</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Thank you for joining our premium circle. Please use the verification code below to complete your registration:</p>
              <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; margin: 30px 0; border-radius: 8px;">
                ${otp}
              </div>
            </div>
          `
        });
      } catch (err) {
        console.log(`[SIMULATED FALLBACK] OTP for ${email}: ${otp}`);
      }
    }

    const user = await User.create({ name, email, password, phone, otp, otpExpire, isVerified: false });
    res.status(201).json({ requiresVerification: true, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, newEmail } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or missing user/code' });
    }

    const updateData = { isVerified: true, $unset: { otp: 1, otpExpire: 1 } };
    if (newEmail) updateData.email = newEmail;

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
