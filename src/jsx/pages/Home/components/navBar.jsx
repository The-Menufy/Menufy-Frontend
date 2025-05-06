import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("role"); // Remove role
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent sticky-top shadow-sm">
      <div className="container">
        {/* Logo Section */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          TheMenuFy
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links, Search, Profile */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* Center Navigation Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/code" className="nav-link">
                Code
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Register" className="nav-link">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Reset" className="nav-link">
                Reset
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/ResetPasswordEmail" className="nav-link">
                Reset Password Email
              </Link>
            </li>
          </ul>

          {/* Right Section: Search Bar & Profile */}
          <div className="d-flex align-items-center gap-3">
            {/* Search Bar */}
            <form
              className="d-flex align-items-center position-relative me-2"
              onSubmit={(e) => e.preventDefault()}
              autoComplete="off"
            >
              <input
                type="text"
                className="form-control rounded-pill ps-4 pe-5"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "180px" }}
              />
              <span className="position-absolute end-0 top-50 translate-middle-y pe-3">
                <Search size={18} className="text-secondary" />
              </span>
            </form>

            {/* Profile Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-light rounded-circle position-relative"
                type="button"
                id="dropdownProfile"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ width: 38, height: 38, padding: 0 }}
              >
                <User size={20} className="text-secondary" />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownProfile"
                style={{ minWidth: "150px" }}
              >
                <li>
                  <Link to="/ProfilePage" className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="dropdown-item">
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
