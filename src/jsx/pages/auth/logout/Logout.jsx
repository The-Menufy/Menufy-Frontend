import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../reset-password/useAuthStore";

function Logout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return null;
}

export default Logout;
