import { Route, Routes } from "react-router-dom";
import AvailableProperties from "../pages/app-routes/available-properties";
import MyProperties from "../pages/app-routes/my-properties";

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/available-properties" element={<AvailableProperties />} />
        <Route path="my-properties" element={<MyProperties />} />
    </Routes>
  );
}