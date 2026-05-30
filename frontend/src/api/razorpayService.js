import api from '../utils/api';

export const razorpayService = {
  createOrder: async (paymentData) => {
    const { data } = await api.post('/api/razorpay/order', paymentData);
    return data;
  },
  verifyPayment: async (verificationData) => {
    const { data } = await api.post('/api/razorpay/verify', verificationData);
    return data;
  }
};

export default razorpayService;
