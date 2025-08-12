import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
  const adminConfigured = localStorage.getItem("adminConfigured");
  
  if (!isAdminLoggedIn || !adminConfigured) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
