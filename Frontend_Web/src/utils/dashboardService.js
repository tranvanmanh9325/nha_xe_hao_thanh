import { authFetch, API_BASE_URL } from './authService';

const DASHBOARD_API_URL = `${API_BASE_URL}/api/v1/dashboard`;

export const getDashboardOverview = async () => {
  const response = await authFetch(`${DASHBOARD_API_URL}/overview`);
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Lấy dữ liệu tổng quan thất bại');
  }
  return data.data;
};

export const getRevenueStatistics = async (startDate, endDate) => {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  });
  const response = await authFetch(`${DASHBOARD_API_URL}/revenue?${params.toString()}`);
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Lấy dữ liệu thống kê doanh thu thất bại');
  }
  return data.data;
};