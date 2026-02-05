import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole === "admin") {
    if (!isLoggedIn || role !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
