import { Route, Routes } from "react-router-dom";
import AvailableProperties from "../pages/app-routes/available-properties";
import MyProperties from "../pages/app-routes/my-properties";
import Profile from "../pages/app-routes/profile";
import MyBookings from "../pages/app-routes/my-bookings";

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/available-properties" element={<AvailableProperties />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}