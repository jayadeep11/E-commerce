import api from '../utils/api';

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  },
  register: async (userData) => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  }
};

export default authService;
