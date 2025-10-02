import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

// Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  items?: Item[];
}

export interface Item {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  owner?: User;
  category: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  condition: string;
  created_at: string;
  updated_at: string;
  views: number;
  status: 'active' | 'inactive' | 'traded';
}

export interface Asset extends Item {
  // Extended asset properties for barter features
  barter_preferences?: string[];
  exchange_value?: number;
  negotiable: boolean;
  delivery_available: boolean;
  payment_methods?: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  asset_id?: string;
}

export interface Trade {
  id: string;
  initiator_id: string;
  receiver_id: string;
  initiator_asset_id: string;
  receiver_asset_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  asset_id: string;
  amount: number;
  currency: string;
  method: 'mobile_money' | 'card' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'trade_request' | 'trade_accepted' | 'trade_rejected' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userData');
          // Navigate to login (handled by AuthContext)
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== AUTHENTICATION ====================

  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await this.api.post('/login/access-token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  }

  async signup(userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    location?: string;
  }): Promise<User> {
    const response = await this.api.post('/users/signup', userData);
    return response.data;
  }

  async verifyToken(): Promise<User> {
    const response = await this.api.post('/login/test-token');
    return response.data;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.api.post(`/password-recovery/${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.api.post('/reset-password/', {
      token,
      new_password: newPassword,
    });
  }

  // ==================== USER MANAGEMENT ====================

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async updateCurrentUser(userData: Partial<User>): Promise<User> {
    const response = await this.api.patch('/users/me', userData);
    return response.data;
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.patch('/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async deleteAccount(): Promise<void> {
    await this.api.delete('/users/me');
  }

  async getUserById(userId: string): Promise<User> {
    const response = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  // Superuser only
  async getAllUsers(page = 1, size = 20): Promise<PaginatedResponse<User>> {
    const response = await this.api.get('/users/', {
      params: { skip: (page - 1) * size, limit: size },
    });
    return response.data;
  }

  // ==================== ASSET/ITEM MANAGEMENT ====================

  async getMyAssets(): Promise<Asset[]> {
    const response = await this.api.get('/items/');
    return response.data;
  }

  async getAssetById(id: string): Promise<Asset> {
    const response = await this.api.get(`/items/${id}`);
    return response.data;
  }

  async createAsset(assetData: {
    title: string;
    description: string;
    category: string;
    price: number;
    currency: string;
    location: string;
    images: string[];
    condition: string;
    barter_preferences?: string[];
    negotiable?: boolean;
    delivery_available?: boolean;
  }): Promise<Asset> {
    const response = await this.api.post('/items/', assetData);
    return response.data;
  }

  async updateAsset(id: string, assetData: Partial<Asset>): Promise<Asset> {
    const response = await this.api.put(`/items/${id}`, assetData);
    return response.data;
  }

  async deleteAsset(id: string): Promise<void> {
    await this.api.delete(`/items/${id}`);
  }

  // ==================== BROWSE & SEARCH ====================

  async browseAssets(params: {
    page?: number;
    size?: number;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'date' | 'price' | 'distance' | 'popularity';
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Asset>> {
    const response = await this.api.get('/assets/browse', { params });
    return response.data;
  }

  async searchAssets(query: string): Promise<Asset[]> {
    const response = await this.api.get('/assets/search', {
      params: { q: query },
    });
    return response.data;
  }

  async getAssetMatches(assetId: string): Promise<Asset[]> {
    const response = await this.api.get(`/assets/${assetId}/matches`);
    return response.data;
  }

  async incrementAssetViews(assetId: string): Promise<void> {
    await this.api.post(`/assets/${assetId}/view`);
  }

  // ==================== TRADING & BARTERING ====================

  async createTradeRequest(tradeData: {
    initiator_asset_id: string;
    receiver_asset_id: string;
    message?: string;
  }): Promise<Trade> {
    const response = await this.api.post('/trades/', tradeData);
    return response.data;
  }

  async getMyTrades(type: 'initiated' | 'received' | 'all' = 'all'): Promise<Trade[]> {
    const response = await this.api.get('/trades/my', {
      params: { type },
    });
    return response.data;
  }

  async getTradeById(id: string): Promise<Trade> {
    const response = await this.api.get(`/trades/${id}`);
    return response.data;
  }

  async respondToTrade(id: string, action: 'accept' | 'reject', message?: string): Promise<Trade> {
    const response = await this.api.post(`/trades/${id}/respond`, {
      action,
      message,
    });
    return response.data;
  }

  async completeTrade(id: string): Promise<Trade> {
    const response = await this.api.post(`/trades/${id}/complete`);
    return response.data;
  }

  async cancelTrade(id: string): Promise<void> {
    await this.api.delete(`/trades/${id}`);
  }

  // ==================== MESSAGING ====================

  async getConversations(): Promise<Message[]> {
    const response = await this.api.get('/messages/conversations');
    return response.data;
  }

  async getMessages(userId: string, assetId?: string): Promise<Message[]> {
    const response = await this.api.get('/messages/', {
      params: { user_id: userId, asset_id: assetId },
    });
    return response.data;
  }

  async sendMessage(receiverId: string, content: string, assetId?: string): Promise<Message> {
    const response = await this.api.post('/messages/', {
      receiver_id: receiverId,
      content,
      asset_id: assetId,
    });
    return response.data;
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await this.api.patch(`/messages/${messageId}/read`);
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.api.delete(`/messages/${messageId}`);
  }

  // ==================== PAYMENTS ====================

  async unlockContactDetails(assetId: string, paymentMethod: string): Promise<Payment> {
    const response = await this.api.post('/payments/unlock-contact', {
      asset_id: assetId,
      payment_method: paymentMethod,
    });
    return response.data;
  }

  async processPayment(paymentData: {
    asset_id: string;
    amount: number;
    currency: string;
    method: string;
    provider_details?: any;
  }): Promise<Payment> {
    const response = await this.api.post('/payments/process', paymentData);
    return response.data;
  }

  async getPaymentHistory(): Promise<Payment[]> {
    const response = await this.api.get('/payments/history');
    return response.data;
  }

  async getPaymentById(id: string): Promise<Payment> {
    const response = await this.api.get(`/payments/${id}`);
    return response.data;
  }

  async verifyPayment(id: string): Promise<Payment> {
    const response = await this.api.post(`/payments/${id}/verify`);
    return response.data;
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications(unreadOnly = false): Promise<Notification[]> {
    const response = await this.api.get('/notifications/', {
      params: { unread_only: unreadOnly },
    });
    return response.data;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.api.patch(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.api.post('/notifications/read-all');
  }

  async deleteNotification(id: string): Promise<void> {
    await this.api.delete(`/notifications/${id}`);
  }

  async updatePushToken(token: string): Promise<void> {
    await this.api.post('/notifications/push-token', { token });
  }

  // ==================== FILE UPLOADS ====================

  async uploadImage(file: any): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'photo.jpg',
    } as any);

    const response = await this.api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async uploadMultipleImages(files: any[]): Promise<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || `photo_${index}.jpg`,
      } as any);
    });

    const response = await this.api.post('/uploads/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // ==================== UTILITIES ====================

  async getCategories(): Promise<string[]> {
    const response = await this.api.get('/utils/categories');
    return response.data;
  }

  async getLocations(): Promise<{ country: string; cities: string[] }[]> {
    const response = await this.api.get('/utils/locations');
    return response.data;
  }

  async getCurrencies(): Promise<{ code: string; name: string; symbol: string }[]> {
    const response = await this.api.get('/utils/currencies');
    return response.data;
  }

  async testEmail(): Promise<void> {
    await this.api.post('/utils/test-email/');
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await this.api.get('/utils/health-check/');
    return response.data;
  }

  // ==================== STATISTICS ====================

  async getUserStats(): Promise<{
    total_assets: number;
    active_assets: number;
    completed_trades: number;
    pending_trades: number;
    total_views: number;
    rating: number;
    joined_date: string;
  }> {
    const response = await this.api.get('/stats/user');
    return response.data;
  }

  async getAssetStats(assetId: string): Promise<{
    views: number;
    saves: number;
    inquiries: number;
    trade_requests: number;
  }> {
    const response = await this.api.get(`/stats/asset/${assetId}`);
    return response.data;
  }
}

export default new ApiService();