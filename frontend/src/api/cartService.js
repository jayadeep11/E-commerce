import api from '../utils/api';

export const cartService = {
  getCart: async () => {
    const { data } = await api.get('/api/cart');
    return data;
  },
  updateCart: async (cartItems) => {
    const { data } = await api.post('/api/cart', { cartItems });
    return data;
  },
  clearCart: async () => {
    const { data } = await api.delete('/api/cart');
    return data;
  }
};

export default cartService;
