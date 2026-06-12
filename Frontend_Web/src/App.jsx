import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import RouteManagement from './pages/RouteManagement';
import Trips from './pages/Trips';
import TripSeatMap from './pages/TripSeatMap';
import Buses from './pages/Buses';
import BusDetail from './pages/BusDetail';
import Tickets from './pages/Tickets';
import Revenue from './pages/Revenue';
import Settings from './pages/Settings';

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <BrowserRouter>
        <Routes>
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
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
