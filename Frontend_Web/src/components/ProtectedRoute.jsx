import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/authService';

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    // Nếu chưa đăng nhập, chuyển hướng về trang chủ và mở modal đăng nhập
    return <Navigate to="/?login=true" replace />;
  }

  // Nếu đã đăng nhập, cho phép truy cập các route con
  return <Outlet />;
};

export default ProtectedRoute;
