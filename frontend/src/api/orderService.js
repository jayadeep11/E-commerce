import api from '../utils/api';

export const orderService = {
  createOrder: async (orderData) => {
    const { data } = await api.post('/api/orders', orderData);
    return data;
  },
  getMyOrders: async () => {
    const { data } = await api.get('/api/orders/myorders');
    return data;
  },
  getMyStats: async () => {
    const { data } = await api.get('/api/orders/mystats');
    return data;
  },
  getOrderById: async (id) => {
    const { data } = await api.get(`/api/orders/${id}`);
    return data;
  },
  getOrders: async () => {
    const { data } = await api.get('/api/orders');
    return data;
  },
  deliverOrder: async (id) => {
    const { data } = await api.put(`/api/orders/${id}/deliver`);
    return data;
  }
};

export default orderService;
