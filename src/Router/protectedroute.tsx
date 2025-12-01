import type { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  if (!user || !user.username || !user.role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
