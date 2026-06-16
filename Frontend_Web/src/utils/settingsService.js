import { authFetch, API_BASE_URL } from './authService';

const SETTINGS_API_URL = `${API_BASE_URL}/api/v1/settings`;

export const fetchSettings = async () => {
  const response = await authFetch(SETTINGS_API_URL);
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Không thể tải cài đặt');
  }
  return data.data;
};

export const updateSettings = async (settingsData) => {
  const response = await authFetch(SETTINGS_API_URL, {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Không thể cập nhật cài đặt');
  }
  return data.data;
};