import { useAuth } from "../hooks/useAuth";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { user } = useAuth();

  return user?.customer?.id ? <AppRoutes /> : <AuthRoutes />;
}
