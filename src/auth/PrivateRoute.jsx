// src/auth/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // token illa na login ku redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // token irundha actual page show pannum
  return children;
}
