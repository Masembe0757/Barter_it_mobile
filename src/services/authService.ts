import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const authService = {
  signIn: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/signin', {email, password});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign in failed');
    }
  },

  signUp: async (email: string, password: string, name: string, phone: string) => {
    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
        name,
        phone,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign up failed');
    }
  },

  verifyAccount: async (code: string) => {
    try {
      const response = await api.post('/auth/verify', {code});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Verification failed');
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', {email});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Request failed');
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Reset failed');
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const response = await api.post('/auth/refresh', {refreshToken});
      await AsyncStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },
};