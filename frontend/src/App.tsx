import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Routes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ToastContainer />
        <Routes />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
