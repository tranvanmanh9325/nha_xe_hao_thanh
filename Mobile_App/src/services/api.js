import axios from 'axios';
import { Platform } from 'react-native';

const getBaseURL = () => {
  if (Platform.OS === 'web') {
    // Tránh lỗi Private Network Access (PNA) của Chrome khi gọi IP LAN (192.168.x.x) từ localhost
    return 'http://localhost:8080/api/v1';
  }
  return process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.1:8080/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Deduplication Map for High Concurrency
const pendingRequests = new Map();

api.interceptors.request.use((config) => {
  const key = `${config.method}:${config.url}?${new URLSearchParams(config.params || {}).toString()}`;
  if (pendingRequests.has(key)) {
    return Promise.reject({ message: 'Duplicate request blocked', config, isDuplicate: true });
  }
  pendingRequests.set(key, true);
  return config;
});

// Exponential Backoff Retry & Deduplication Cleanup
api.interceptors.response.use(
  (response) => {
    const key = `${response.config.method}:${response.config.url}?${new URLSearchParams(response.config.params || {}).toString()}`;
    pendingRequests.delete(key);
    return response;
  },
  async (error) => {
    if (error.config) {
      const key = `${error.config.method}:${error.config.url}?${new URLSearchParams(error.config.params || {}).toString()}`;
      pendingRequests.delete(key);
    }
    
    // Ignore duplicate rejections silently if handled correctly by UI, or just pass it down
    if (error.isDuplicate) return Promise.reject(error);

    const config = error.config;
    if (!config) return Promise.reject(error);

    config.retryCount = config.retryCount || 0;
    // Retry on 5xx errors or network timeouts
    const shouldRetry = (error.response && error.response.status >= 500) || 
                        error.code === 'ECONNABORTED' || 
                        error.message === 'Network Error';

    if (shouldRetry && config.retryCount < 3) {
      config.retryCount += 1;
      // Exponential backoff with jitter: 2^retryCount * 1000ms + random(0-500ms)
      const delay = Math.pow(2, config.retryCount) * 1000 + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }
    return Promise.reject(error);
  }
);

export default api;