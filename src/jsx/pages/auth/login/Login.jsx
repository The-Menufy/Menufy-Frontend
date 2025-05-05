import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/logo.png";
import loginBg from "../../../../assets/images/login/bg-1.jpeg";
import { Alert, Row, Stack } from "react-bootstrap";
import GoogleAuth from "./GoogleAuth";
import ReCAPTCHA from "react-google-recaptcha";
import { authStore } from "../../../store/authStore";
import { useState } from "react";
import FacebookAuth from "./FacebookAuth";
import { Toast, ToastContainer } from "react-bootstrap";
import { getDeviceInfo } from "../../../utils/deviceInfo";
import "./css/login.css";

// Validation Schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "admin@menufy.com",
      password: "Admin@123",
    },
  });
  const [deviceId] = useState(getDeviceInfo());
  const [recaptcha, setRecaptcha] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const navigate = useNavigate();
  const { login, currentUser } = authStore();

  const onSubmit = async (data) => {
    try {
      await login(data);
      if (currentUser?.user) {
        setToast({
          show: true,
          message: "Login successful!",
          variant: "success",
        });
        setTimeout(() => {
          setToast({ ...toast, show: false });
          navigate("/");
        }, 1500);
      } else {
        setToast({
          show: true,
          message: currentUser?.message || "Login failed.",
          variant: "danger",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "Login failed.",
        variant: "danger",
      });
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 p-2 lg-p-4">
      <ToastContainer position="top-center" className="mt-5">
        <Toast
          bg={toast.variant}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="container w-100 md-m-auto mx-2">
        <div className="row g-0 align-items-center rounded-3 shadow-lg">
          <img
            src={loginBg}
            alt="Background"
            className="d-md-none d-block col-12 rounded-top "
            style={{
              objectPosition: "bottom",
              maxHeight: "200px",
              objectFit: "cover",
            }}
          />
          {/* Left Column: Form */}
          <div className="col-lg-6 col-md-7 d-flex align-items-center p-4">
            <div className="w-100">
              {/* Logo */}
              <img
                src={logo}
                alt="Menufy Logo"
                className="mb-3 w-50 mx-auto d-block"
              />
              {/* Sign Up Prompt */}
              <p className="text-center text-muted mb-4">
                Don't have an account?{" "}
                <Link className="text-primary" to="/signup">
                  Sign up
                </Link>
              </p>
              {/* Error Alert */}
              {currentUser?.status === false && currentUser.message && (
                <Alert variant="info">{currentUser.message}</Alert>
              )}
              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={3}>
                  {/* Email Field */}
                  <div>
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          className="form-control"
                        />
                      )}
                    />
                    {errors.email && (
                      <small className="text-danger">
                        {errors.email.message}
                      </small>
                    )}
                  </div>
                  {/* Password Field */}
                  <div>
                    <label className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                          />
                        )}
                      />
                      <span
                        className={`show-pass eye ${
                          showPassword ? "active" : ""
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {showPassword ? (
                          <i className="fa fa-eye-slash"></i>
                        ) : (
                          <i className="fa fa-eye"></i>
                        )}
                      </span>
                    </div>
                    {errors.password && (
                      <small className="text-danger">
                        {errors.password.message}
                      </small>
                    )}
                    <p className="text-muted mt-2 mb-0 ">
                      Forgot Password?{" "}
                      <Link className="text-primary" to="/forgot-password">
                        Reset
                      </Link>
                    </p>
                  </div>
                  {/* Captcha and Terms */}
                  <Stack gap={2}>
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={(value) => setRecaptcha(value)}
                      size="normal"
                    />
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="terms-checkbox"
                        required
                      />
                      <label
                        className="form-check-label text-muted pt-2"
                        htmlFor="terms-checkbox"
                      >
                        I agree to the{" "}
                        <Link className="text-primary" to="/terms">
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link className="text-primary" to="/privacy-policy">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </Stack>
                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary w-100">
                    Sign In
                  </button>
                  {/* Social Logins */}
                  <Row xs={1} sm={2} className="g-2 justify-content-center">
                    <FacebookAuth />
                    <GoogleAuth />
                  </Row>
                </Stack>
              </form>
            </div>
          </div>
          {/* Right Column: Background */}
          <img
            src={loginBg}
            alt="Background"
            style={{ minHeight: "580px", objectFit: "cover" }}
            className="d-none d-md-block col-lg-6 col-md-5 rounded-end h-25 order-last md:h-100 object-cover aspect-16/9 object-bottom md:object-center"
          />
        </div>
      </div>
    </div>
  );
}
export default Login;
