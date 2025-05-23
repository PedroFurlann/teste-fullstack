import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth-routes/login";
import Register from "../pages/auth-routes/register";
import { Home } from "../pages/auth-routes/home";

export const AuthRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </Routes>
  );
}