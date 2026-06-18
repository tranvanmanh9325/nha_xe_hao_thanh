import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.1:8080/api/v1',
  timeout: 10000,
});

export default api;