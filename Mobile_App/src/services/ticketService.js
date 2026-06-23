import api from './api';

const ticketService = {
  /**
   * Fetch my tickets with optional status filter and pagination
   * @param {string} status - 'all', 'paid', 'unpaid', 'pending', 'cancelled'
   * @param {number} page - page number (0-indexed)
   * @param {number} size - page size
   * @returns {Promise<any>}
   */
  getMyTickets: async (status = 'all', page = 0, size = 10) => {
    try {
      const params = {
        page,
        size,
        sort: 'createdAt,desc',
      };
      
      if (status && status !== 'all') {
        params.status = status;
      }
      
      const response = await api.get('/tickets/me', { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đặt vé:', error);
      throw error;
    }
  },
};

export default ticketService;