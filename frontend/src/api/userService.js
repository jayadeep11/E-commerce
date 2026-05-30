import api from '../utils/api';

export const userService = {
  login: async (credentials) => {
    const { data } = await api.post('/api/users/login', credentials);
    return data;
  },
  register: async (userData) => {
    const { data } = await api.post('/api/users', userData);
    return data;
  },
  verifyOtp: async (otpData) => {
    const { data } = await api.post('/api/users/verify-otp', otpData);
    return data;
  },
  getProfile: async () => {
    const { data } = await api.get('/api/users/profile');
    return data;
  },
  updateProfile: async (profileData) => {
    const { data } = await api.put('/api/users/profile', profileData);
    return data;
  },
  getUsers: async () => {
    const { data } = await api.get('/api/users');
    return data;
  },
  addAddress: async (addressData) => {
    const { data } = await api.post('/api/users/addresses', addressData);
    return data;
  },
  updateAddress: async (id, addressData) => {
    const { data } = await api.put(`/api/users/addresses/${id}`, addressData);
    return data;
  },
  deleteAddress: async (id) => {
    const { data } = await api.delete(`/api/users/addresses/${id}`);
    return data;
  },
  setDefaultAddress: async (id) => {
    const { data } = await api.put(`/api/users/addresses/${id}/default`);
    return data;
  }
};

export default userService;
