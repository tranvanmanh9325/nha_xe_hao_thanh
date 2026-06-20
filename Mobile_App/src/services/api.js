import axios from 'axios';
import { Platform } from 'react-native';

const getBaseURL = () => {
  if (Platform.OS === 'web') {
    // Avoid Chrome Private Network Access (PNA) errors when calling LAN IP from localhost
    return 'http://localhost:8080/api/v1';
  }
  return process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.1:8080/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Deduplication for idempotent GET requests only
const pendingGetRequests = new Map();

api.interceptors.request.use((config) => {
  if (config.method !== 'get') return config;

  const key = `${config.url}?${new URLSearchParams(config.params || {}).toString()}`;

  if (pendingGetRequests.has(key)) {
    const controller = new AbortController();
    controller.abort();
    config.signal = controller.signal;
    return config;
  }

  pendingGetRequests.set(key, true);
  config._deduplicationKey = key;
  return config;
});

// Exponential Backoff Retry & Deduplication Cleanup
api.interceptors.response.use(
  (response) => {
    if (response.config._deduplicationKey) {
      pendingGetRequests.delete(response.config._deduplicationKey);
    }
    return response;
  },
  async (error) => {
    if (error.config?._deduplicationKey) {
      pendingGetRequests.delete(error.config._deduplicationKey);
    }

    // Silently swallow aborted duplicate requests
    if (axios.isCancel(error)) return Promise.reject(error);

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