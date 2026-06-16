
const ConfirmCancelModal = ({ isOpen, onClose, onConfirm, trip, isCancelling }) => {
  if (!isOpen || !trip) return null;

  // Format departureTime
  const depDate = new Date(trip.departureTime);
  const formattedTime = !isNaN(depDate) 
    ? `${String(depDate.getHours()).padStart(2, '0')}:${String(depDate.getMinutes()).padStart(2, '0')} - ${String(depDate.getDate()).padStart(2, '0')}/${String(depDate.getMonth() + 1).padStart(2, '0')}/${depDate.getFullYear()}`
    : trip.departureTime || trip.departure || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận hủy chuyến xe</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn hủy chuyến xe <span className="font-semibold text-slate-800">{trip.route}</span> khởi hành lúc <span className="font-semibold text-slate-800">{formattedTime}</span>?
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Hành động này sẽ cập nhật trạng thái chuyến sang "Hủy" và không thể hoàn tác.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-transparent hover:bg-slate-200 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${isCancelling ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isCancelling ? 'Đang hủy...' : 'Hủy chuyến'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelModal;
