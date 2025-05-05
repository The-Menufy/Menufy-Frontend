import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./login/Login";
import { authStore } from "../../store/authStore";
import { useEffect, useMemo } from "react";
import ForgotPassword from "./reset-password/ForgotPassword";
import DeviceVerification from "./login/DeviceVerification";
import Terms from "./login/components/Terms";
import { Signup } from "./signup/Signup";
export default function AuthRouting() {
  const { currentUser, verifyDevice, getProfile, logout } = authStore();
  const location = useLocation();
  const availableRoutes = useMemo(
    () => ["/login", "/forgotPassword", "/signup", "/terms"],
    []
  );
  const navigate = useNavigate();
  useEffect(() => {
    const checkDevice = async () => {
      if (
        currentUser?.user &&
        currentUser?.token &&
        !location.pathname.includes("/verify-device")
      ) {
        try {
          const user = await getProfile(currentUser.token);
          if (!user) {
            logout();
          } else {
            verifyDevice(user);
          }
        } catch (error) {
          console.error("Device check failed:", error);
          logout();
        }
      }
    };
    // Only check device when token or location changes
    if (currentUser?.token) {
      checkDevice();
    }
    // Handle navigation
    if (!currentUser?.user && !availableRoutes.includes(location.pathname)) {
      navigate("/login");
    } else if (
      currentUser?.user &&
      availableRoutes.includes(location.pathname)
    ) {
      navigate("/");
    }
  }, [currentUser?.token, location.pathname, availableRoutes]);
  return (
    <Routes>
      <Route path="login" element={<Login />}></Route>
      <Route path="terms" element={<Terms />}></Route>
      <Route path="forgotPassword" element={<ForgotPassword />}></Route>
      <Route path="signup" element={<Signup />}></Route>
      <Route
        path="verify-device/:token"
        element={<DeviceVerification />}
      ></Route>
    </Routes>
  );
}
