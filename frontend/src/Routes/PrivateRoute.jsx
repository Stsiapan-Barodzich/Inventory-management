import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/api/token" replace />;
};

export default PrivateRoute;

