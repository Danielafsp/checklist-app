import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { profile, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && !profile) {
    return <div>Loading...</div>;
  }

  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
