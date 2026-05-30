const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  verifyOtp,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);

module.exports = router;
