import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );

  const login = async (email, password) => {
    const { data } = await api.post('/api/users/login', { email, password });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password, phone, profilePic = '', isAdmin = false) => {
    const { data } = await api.post('/api/users', { name, email, password, phone, profilePic, isAdmin });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const updateProfile = async (userData) => {
    const { data } = await api.put('/api/users/profile', userData);
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const refreshProfile = async () => {
    if (!userInfo) return;
    try {
      const { data } = await api.get('/api/users/profile');
      const updatedInfo = { ...userInfo, ...data };
      setUserInfo(updatedInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  
  const addAddress = async (addressData) => {
    const { data } = await api.post('/api/users/addresses', addressData);
    const updatedInfo = { ...userInfo, addresses: data };
    setUserInfo(updatedInfo);
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    return data;
  };

  const updateAddress = async (id, addressData) => {
    const { data } = await api.put(`/api/users/addresses/${id}`, addressData);
    const updatedInfo = { ...userInfo, addresses: data };
    setUserInfo(updatedInfo);
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    return data;
  };

  const deleteAddress = async (id) => {
    const { data } = await api.delete(`/api/users/addresses/${id}`);
    const updatedInfo = { ...userInfo, addresses: data };
    setUserInfo(updatedInfo);
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    return data;
  };

  const setDefaultAddress = async (id) => {
    const { data } = await api.put(`/api/users/addresses/${id}/default`);
    const updatedInfo = { ...userInfo, addresses: data };
    setUserInfo(updatedInfo);
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    return data;
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ 
      userInfo, login, register, logout, refreshProfile, updateProfile,
      addAddress, updateAddress, deleteAddress, setDefaultAddress 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
