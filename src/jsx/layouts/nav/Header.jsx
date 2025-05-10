import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import Logout from "./Logout";
import profile from "../../../assets/images/profile/17.jpg";
import { authStore } from "../../store/authStore";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Load backend URL from environment
const backendURL = import.meta.env.VITE_BACKEND_URL?.replace("/api", "") || "https://menufy-backend.onrender.com";

// Set up socket connection
const socket = io(backendURL, {
  transports: ["websocket"],
  path: "/socket.io",
});

const Header = () => {
  const { currentUser } = authStore();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "en");
  const [notifications, setNotifications] = useState([]);
  const [notifUnread, setNotifUnread] = useState(0);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  // Listen for product notifications
  useEffect(() => {
    socket.on("productAdded", (data) => {
      setNotifications((prev) => [{ message: data.message, time: new Date() }, ...prev]);
      setNotifUnread((prev) => prev + 1);
      toast.info(data.message || t("new_product_added"));
    });
    return () => socket.off("productAdded");
    // eslint-disable-next-line
  }, []);

  // Mark notifications as read when dropdown is opened
  const handleNotifDropdownOpen = () => setNotifUnread(0);

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div
                className="dashboard_bar"
                style={{ textTransform: "capitalize" }}
              ></div>
            </div>
            <ul className="navbar-nav header-right">
              <li className="nav-item">
                <div className="input-group search-area d-xl-inline-flex d-none">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("search_placeholder")}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <Link to="#">
                        <i className="flaticon-381-search-2" />
                      </Link>
                    </span>
                  </div>
                </div>
              </li>
              <li className="nav-item me-2">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    className="btn-sm"
                    style={{ width: 90 }}
                  >
                    {lang.toUpperCase()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => changeLanguage("en")}>EN</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLanguage("fr")}>FR</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLanguage("es")}>ES</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLanguage("pt")}>PT</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLanguage("ar")}>AR</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              {/* Notification Bell Dropdown */}
              <Dropdown
                className="nav-item dropdown notification_dropdown"
                as="li"
                onToggle={handleNotifDropdownOpen}
              >
                <Dropdown.Toggle
                  variant=""
                  className="nav-link i-false c-pointer position-relative"
                  as="a"
                  id="notificationDropdown"
                >
                  {/* Custom Bell Icon */}
                  <span style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1827/1827312.png"
                      alt="Notifications"
                      width={24}
                      height={24}
                      style={{ verticalAlign: "middle" }}
                    />
                    {notifUnread > 0 && (
                      <span
                        className="badge light text-white bg-danger rounded-circle"
                        style={{
                          fontSize: "10px",
                          position: "absolute",
                          top: "-4px",
                          right: "-4px"
                        }}
                      >
                        {notifUnread}
                      </span>
                    )}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="mt-2">
                  <div className="widget-media dz-scroll p-3 height380 ps">
                    <ul className="timeline">
                      {notifications.length === 0 ? (
                        <li className="dropdown-item text-muted">{t("no_notifications")}</li>
                      ) : (
                        notifications.slice(0, 5).map((notif, idx) => (
                          <li key={idx} className="dropdown-item">
                            <div>
                              <strong>{notif.message}</strong>
                              <div className="small text-muted">{notif.time?.toLocaleTimeString()}</div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <Link className="all-notification" to="#">
                    {t("see_all_notifications")} <i className="ti-arrow-right" />
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
              {/* Profile Dropdown */}
              <Dropdown className="nav-item dropdown header-profile" as="li">
                <Dropdown.Toggle
                  as="a"
                  to="#"
                  variant=""
                  className="nav-link  i-false p-0c-pointer pointr"
                >
                  <img
                    src={currentUser?.user?.image || profile}
                    width={20}
                    style={{ objectFit: "cover" }}
                    alt="profile"
                  />
                  <div className="header-info">
                    <span className="text-black">
                      <strong>{currentUser?.user?.email || "Admin "}</strong>
                    </span>
                    <p className="fs-12 mb-0">
                      {currentUser?.user?.__t || t("user")}
                    </p>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="mt-2">
                  <Link to="/profile" className="dropdown-item ai-icon">
                    <span className="ms-2">{t("profile")}</span>
                  </Link>
                  <Link to="/email-inbox" className="dropdown-item ai-icon">
                    <span className="ms-2">{t("inbox")}</span>
                  </Link>
                  <Logout />
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default Header;