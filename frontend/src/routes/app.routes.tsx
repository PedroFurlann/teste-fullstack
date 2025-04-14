import { Route, Routes } from "react-router-dom";
import AvailableProperties from "../pages/app-routes/available-properties";

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/available-properties" element={<AvailableProperties />} />
    </Routes>
  );
}