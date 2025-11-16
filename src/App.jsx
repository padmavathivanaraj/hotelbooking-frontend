import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import HotelsList from "./pages/HotelsList.jsx";
import HotelDetail from "./pages/HotelDetail.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import AddHotel from "./pages/AddHotel.jsx";
import PrivateRoute from "./auth/PrivateRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected pages (currently token only on frontend; backend still open, ok for now) */}
        <Route
          path="/hotels"
          element={
            <PrivateRoute>
              <HotelsList />
            </PrivateRoute>
          }
        />

        <Route
          path="/hotel/:id"
          element={
            <PrivateRoute>
              <HotelDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-hotel"
          element={
            <PrivateRoute>
              <AddHotel />
            </PrivateRoute>
          }
        />

        {/* Default: go to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}