import { BrowserRouter } from "react-router-dom"
import { AuthRoutes } from "./routes/auth.routes"
import { AuthContextProvider } from "./contexts/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AuthRoutes />
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App