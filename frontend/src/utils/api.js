import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});


api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;
    
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.expired
    ) {
      localStorage.removeItem('userInfo');

      window.dispatchEvent(
        new CustomEvent('showToast', {
          detail: {
            type: 'error',
            message: 'Session expired. Please login again.'
          }
        })
      );

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default api;
