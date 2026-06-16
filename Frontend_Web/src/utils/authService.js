export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Core fetch wrapper that auto-attaches JWT token from localStorage.
 * All admin API calls should use this instead of raw fetch().
 */
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON payloads (skip for multipart/form-data)
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...options, headers });

  // Auto-logout on 401/403 (token expired or invalid)
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.location.href = '/?sessionExpired=true';
    throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
  }

  return response;
};

export const login = async (phone, password) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Đăng nhập thất bại');
  }

  // Persist token
  localStorage.setItem('accessToken', data.data.accessToken);
  return data;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  window.location.href = '/';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await authFetch(`${API_BASE_URL}/api/v1/auth/change-password`, {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Không thể đổi mật khẩu');
  }
  
  return data;
};

