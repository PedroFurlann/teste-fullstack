import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth-routes/login";
import Register from "../pages/auth-routes/register";

export const AuthRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </Routes>
  );
}