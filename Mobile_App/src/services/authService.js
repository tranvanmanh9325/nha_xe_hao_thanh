import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const TOKEN_KEY = 'auth_token';

// In-memory cache to avoid redundant AsyncStorage I/O on every request
let cachedToken = null;

/**
 * Injects Authorization header for all outgoing requests when token exists.
 * Placed here instead of api.js to keep the generic HTTP client decoupled from auth logic.
 */
api.interceptors.request.use(async (config) => {
  const token = await authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  async login(phone, password) {
    const { data } = await api.post('/auth/login', { phone, password });
    cachedToken = data.data.accessToken;
    await AsyncStorage.setItem(TOKEN_KEY, cachedToken);
    return data;
  },

  async register(fullName, phone, password) {
    const { data } = await api.post('/auth/register', { fullName, phone, password });
    cachedToken = data.data.accessToken;
    await AsyncStorage.setItem(TOKEN_KEY, cachedToken);
    return data;
  },

  async logout() {
    cachedToken = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async getProfile() {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  async getNotificationSettings() {
    const { data } = await api.get('/auth/me/notification-settings');
    return data.data;
  },

  async updateNotificationSettings(settings) {
    const { data } = await api.put('/auth/me/notification-settings', settings);
    return data.data;
  },

  /**
   * Returns cached token when available, falls back to AsyncStorage on cold start.
   */
  async getToken() {
    if (cachedToken) return cachedToken;
    cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    return cachedToken;
  },

  async isAuthenticated() {
    const token = await authService.getToken();
    return !!token;
  },

  /**
   * Extracts a user-friendly error message from Axios error responses.
   * Falls back to generic messages for network/unknown errors.
   */
  getErrorMessage(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Kết nối quá thời gian. Vui lòng thử lại.';
    }

    if (error.message === 'Network Error' || error.message.includes('Network request failed')) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại địa chỉ IP backend (BASE_URL) hoặc mạng của bạn.';
    }

    return 'Đã xảy ra lỗi. Vui lòng thử lại sau. (Chi tiết: ' + error.message + ')';
  },
};

export default authService;