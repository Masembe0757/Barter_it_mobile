export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_KEY || 'pk_test_your_stripe_key_here';

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000,
};

export const CURRENCIES = ['UGX', 'KES', 'ZAR', 'NGN', 'GHS'];

export const CURRENCY_DATA = {
  UGX: {symbol: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬'},
  KES: {symbol: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪'},
  ZAR: {symbol: 'ZAR', name: 'South African Rand', flag: '🇿🇦'},
  NGN: {symbol: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬'},
  GHS: {symbol: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭'},
};

export const CATEGORIES = [
  {id: '1', name: 'Electronics', icon: '📱'},
  {id: '2', name: 'Vehicles', icon: '🚗'},
  {id: '3', name: 'Livestock', icon: '🐄'},
  {id: '4', name: 'Farm Tools', icon: '🚜'},
  {id: '5', name: 'Furniture', icon: '🪑'},
  {id: '6', name: 'Clothing', icon: '👕'},
  {id: '7', name: 'Books', icon: '📚'},
  {id: '8', name: 'Appliances', icon: '🏠'},
  {id: '9', name: 'Building Materials', icon: '🏗️'},
  {id: '10', name: 'Food & Produce', icon: '🌾'},
];

export const APP_CONFIG = {
  appName: 'BarterHub',
  tagline: 'Trade Assets, Build Community',
  supportEmail: 'support@barterhub.com',
  termsUrl: 'https://barterhub.com/terms',
  privacyUrl: 'https://barterhub.com/privacy',
  minPasswordLength: 6,
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxImagesPerAsset: 5,
  searchRadius: 50, // km
  defaultCurrency: 'UGX',
};

export const PAYMENT_CONFIG = {
  unlockFee: 5.00, // USD
  currency: 'usd',
  paymentMethods: ['card', 'mobile_money'],
};