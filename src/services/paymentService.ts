import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL, STRIPE_PUBLISHABLE_KEY, PAYMENT_CONFIG} from '../constants/config';

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

interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export const paymentService = {
  createPaymentIntent: async (amount: number, currency: string = PAYMENT_CONFIG.currency) => {
    try {
      const response = await api.post('/payments/create-intent', {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
      });
      return response.data as PaymentIntent;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  },

  unlockContactDetails: async (assetId: string) => {
    try {
      const response = await api.post('/payments/unlock-contact', {
        assetId,
        amount: PAYMENT_CONFIG.unlockFee,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unlock contact details');
    }
  },

  processPayment: async (paymentMethodId: string, amount: number) => {
    try {
      const response = await api.post('/payments/process', {
        paymentMethodId,
        amount: Math.round(amount * 100),
        currency: PAYMENT_CONFIG.currency,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Payment failed');
    }
  },

  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load payment history');
    }
  },

  addPaymentMethod: async (paymentMethodId: string) => {
    try {
      const response = await api.post('/payments/methods', {
        paymentMethodId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add payment method');
    }
  },

  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load payment methods');
    }
  },

  deletePaymentMethod: async (paymentMethodId: string) => {
    try {
      await api.delete(`/payments/methods/${paymentMethodId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete payment method');
    }
  },

  processMobileMoneyPayment: async (phoneNumber: string, amount: number, provider: 'mtn' | 'airtel') => {
    try {
      const response = await api.post('/payments/mobile-money', {
        phoneNumber,
        amount: Math.round(amount * 100),
        provider,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Mobile money payment failed');
    }
  },

  verifyMobileMoneyPayment: async (transactionId: string, otp: string) => {
    try {
      const response = await api.post('/payments/mobile-money/verify', {
        transactionId,
        otp,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },
};