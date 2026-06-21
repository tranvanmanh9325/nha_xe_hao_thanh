import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Clock, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { authFetch, API_BASE_URL } from '../utils/authService';

const SupportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRequests(page, filterStatus);
  }, [page, filterStatus]);

  async function fetchRequests(currentPage = page, currentStatus = filterStatus) {
    setLoading(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/support-requests?page=${currentPage}&size=10&status=${currentStatus}`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.data.items || []);
        setTotalPages(data.data.totalPages || 1);
      } else {
        toast.error(data.message || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/support-requests/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchRequests(page, filterStatus);
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      } else {
        toast.error(data.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi kết nối đến máy chủ');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yêu cầu hỗ trợ</h1>
          <p className="text-gray-500 mt-1">Quản lý các yêu cầu hỗ trợ từ khách hàng</p>
        </div>
        <button 
          onClick={() => fetchRequests(page, filterStatus)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex gap-2">
          {['ALL', 'PENDING', 'RESOLVED'].map(status => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setPage(0); // Reset page when changing filter
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'ALL' ? 'Tất cả' : status === 'PENDING' ? 'Chờ xử lý' : 'Đã giải quyết'}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Người gửi</th>
                <th className="p-4 font-medium">Chủ đề</th>
                <th className="p-4 font-medium">Tiêu đề</th>
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Không có yêu cầu hỗ trợ nào</td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{req.userFullName}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {req.topic}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700 max-w-xs truncate">{req.title}</td>
                    <td className="p-4 text-gray-500">
                      {format(new Date(req.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </td>
                    <td className="p-4 text-center">
                      {req.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock size={12} /> Chờ xử lý
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} /> Đã giải quyết
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <button 
            disabled={page === 0 || loading} 
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Trang trước
          </button>
          <span className="text-sm font-medium text-gray-600">Trang {page + 1} / {totalPages > 0 ? totalPages : 1}</span>
          <button 
            disabled={page >= totalPages - 1 || loading} 
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Trang sau
          </button>
        </div>
      </div>

      {/* Modal Chi tiết */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết yêu cầu</h2>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Người gửi</p>
                  <p className="font-medium text-gray-900">{selectedRequest.userFullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Thời gian gửi</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(selectedRequest.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Chủ đề</p>
                  <p className="font-medium text-blue-600">{selectedRequest.topic}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                  <p className="font-medium">
                    {selectedRequest.status === 'PENDING' ? (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <Clock size={16} /> Chờ xử lý
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle size={16} /> Đã giải quyết
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Tiêu đề</p>
                <div className="p-3 bg-gray-50 rounded-lg font-medium text-gray-900 border border-gray-100">
                  {selectedRequest.title}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Nội dung chi tiết</p>
                <div className="p-4 bg-gray-50 rounded-lg text-gray-800 border border-gray-100 whitespace-pre-wrap min-h-[120px]">
                  {selectedRequest.description}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              {selectedRequest.status === 'PENDING' && (
                <button
                  onClick={() => updateStatus(selectedRequest.id, 'RESOLVED')}
                  className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-sm flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Đánh dấu Đã giải quyết
                </button>
              )}
              {selectedRequest.status === 'RESOLVED' && (
                <button
                  onClick={() => updateStatus(selectedRequest.id, 'PENDING')}
                  className="px-6 py-2.5 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Clock size={18} />
                  Đánh dấu Chờ xử lý
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportRequests;