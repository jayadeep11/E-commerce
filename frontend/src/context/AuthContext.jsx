import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password, phone) => {
    const { data } = await axios.post('http://localhost:5000/api/users', { name, email, password, phone });
    
    // If phone was provided, backend returns requiresVerification
    if (data.requiresVerification) {
      return data; // Return to component to show OTP field
    }

    // Otherwise, it's a direct login (no phone)
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const verifyOTP = async (email, otp, newEmail = null) => {
    const { data } = await axios.post('http://localhost:5000/api/users/verify-otp', { email, otp, newEmail });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const updateProfile = async (userData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put('http://localhost:5000/api/users/profile', userData, config);
    
    if (!data.requiresVerification) {
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    }
    return data;
  };

  const refreshProfile = async () => {
    if (!userInfo) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
      const updatedInfo = { ...userInfo, ...data };
      setUserInfo(updatedInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, logout, refreshProfile, verifyOTP, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
