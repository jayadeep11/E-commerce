const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/userController');

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/addresses')
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.put('/addresses/:id/default', protect, setDefaultAddress);

module.exports = router;
