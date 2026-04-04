import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "provider") {
      return <Navigate to="/provider" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
