import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load all pages for Code Splitting (Performance Optimization)
const GuestHomepage = React.lazy(() => import('./pages/b2c/GuestHomepage'));
const Schedule = React.lazy(() => import('./pages/b2c/Schedule'));
const SearchResults = React.lazy(() => import('./pages/b2c/SearchResults'));

const DashboardLayout = React.lazy(() => import('./components/layout/DashboardLayout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const RouteManagement = React.lazy(() => import('./pages/RouteManagement'));
const Trips = React.lazy(() => import('./pages/Trips'));
const TripSeatMap = React.lazy(() => import('./pages/TripSeatMap'));
const Buses = React.lazy(() => import('./pages/Buses'));
const BusDetail = React.lazy(() => import('./pages/BusDetail'));
const Tickets = React.lazy(() => import('./pages/Tickets'));
const Revenue = React.lazy(() => import('./pages/Revenue'));
const Settings = React.lazy(() => import('./pages/Settings'));
const SupportChat = React.lazy(() => import('./pages/SupportChat'));
const SupportRequests = React.lazy(() => import('./pages/SupportRequests'));
import ProtectedRoute from './components/ProtectedRoute';

// Loading Fallback Component
const Loader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public Routes (B2C) */}
            <Route path="/" element={<GuestHomepage />} />
            <Route path="/lich-trinh" element={<Schedule />} />
            <Route path="/tra-cuu-ve" element={<SearchResults />} />

            {/* Admin Routes (B2B) */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="routes" element={<RouteManagement />} />
                <Route path="trips">
                  <Route index element={<Trips />} />
                  <Route path=":id/seats" element={<TripSeatMap />} />
                </Route>
                <Route path="buses">
                  <Route index element={<Buses />} />
                  <Route path=":busId" element={<BusDetail />} />
                </Route>
                <Route path="tickets" element={<Tickets />} />
                <Route path="revenue" element={<Revenue />} />
                <Route path="chat" element={<SupportChat />} />
                <Route path="support-requests" element={<SupportRequests />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;