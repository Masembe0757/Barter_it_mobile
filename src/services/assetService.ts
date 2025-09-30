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

interface AssetFilters {
  category?: string | null;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  radius?: number;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'distance';
}

export const assetService = {
  getAssets: async (filters?: AssetFilters) => {
    try {
      // For demo, return mock data
      const mockAssets = [
        {
          id: '1',
          name: 'iPhone 14 Pro Max',
          description: 'Excellent condition, barely used. Comes with original box and accessories.',
          value: 150000,
          currency: 'UGX',
          location: 'Nairobi, Kenya',
          category: 'Electronics',
          images: ['https://via.placeholder.com/300'],
          distance: '2.3 km',
          postedDate: '2024-01-20',
          views: 45,
          isFavorited: false,
          owner: {
            id: '1',
            name: 'John K.',
            rating: 4.8,
            trades: 12,
            avatar: 'https://via.placeholder.com/40',
          },
        },
        {
          id: '2',
          name: 'Toyota Camry 2020',
          description: 'Well maintained, low mileage. Perfect for family use.',
          value: 2800000,
          currency: 'UGX',
          location: 'Westlands, Nairobi',
          category: 'Vehicles',
          images: ['https://via.placeholder.com/300'],
          distance: '5.8 km',
          postedDate: '2024-01-18',
          views: 78,
          isFavorited: true,
          owner: {
            id: '2',
            name: 'Mary W.',
            rating: 4.9,
            trades: 8,
            avatar: 'https://via.placeholder.com/40',
          },
        },
      ];

      return mockAssets;

      // Real API call would be:
      // const response = await api.get('/assets', {params: filters});
      // return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load assets');
    }
  },

  getAssetDetail: async (assetId: string) => {
    try {
      const response = await api.get(`/assets/${assetId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load asset details');
    }
  },

  createAsset: async (assetData: FormData) => {
    try {
      const response = await api.post('/assets', assetData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create asset');
    }
  },

  updateAsset: async (assetId: string, assetData: FormData) => {
    try {
      const response = await api.put(`/assets/${assetId}`, assetData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update asset');
    }
  },

  deleteAsset: async (assetId: string) => {
    try {
      await api.delete(`/assets/${assetId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete asset');
    }
  },

  toggleFavorite: async (assetId: string) => {
    try {
      const response = await api.post(`/assets/${assetId}/favorite`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to toggle favorite');
    }
  },

  getUserAssets: async (userId?: string) => {
    try {
      const response = await api.get(`/users/${userId || 'me'}/assets`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load user assets');
    }
  },

  searchAssets: async (query: string, filters?: AssetFilters) => {
    try {
      const response = await api.get('/assets/search', {
        params: {q: query, ...filters},
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  },
};