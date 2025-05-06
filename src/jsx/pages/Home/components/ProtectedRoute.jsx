import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = JSON.parse(localStorage.getItem("user")) || {};

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
ProtectedRoute.propTypes = {
  requiredRole: PropTypes.string.isRequired,
};

export default ProtectedRoute;
