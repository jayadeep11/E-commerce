import api from '../utils/api';

export const productService = {
  getProducts: async (params = {}) => {
    const { data } = await api.get('/api/products', { params });
    return data;
  },
  getProductById: async (id) => {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },
  createProduct: async (productData) => {
    const { data } = await api.post('/api/products', productData);
    return data;
  },
  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/api/products/${id}`, productData);
    return data;
  },
  deleteProduct: async (id) => {
    const { data } = await api.delete(`/api/products/${id}`);
    return data;
  },
  createReview: async (productId, reviewData) => {
    const { data } = await api.post(`/api/products/${productId}/reviews`, reviewData);
    return data;
  }
};

export default productService;
