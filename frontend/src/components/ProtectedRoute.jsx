import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check single role or multiple allowed roles
  const rolesToCheck = allowedRoles || (role ? [role] : []);
  const currentRole = typeof user.role === "string" ? user.role.trim().toLowerCase() : "";
  const normalizedRoles = rolesToCheck.map((allowedRole) => allowedRole.trim().toLowerCase());
  
  if (normalizedRoles.length > 0 && !normalizedRoles.includes(currentRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
