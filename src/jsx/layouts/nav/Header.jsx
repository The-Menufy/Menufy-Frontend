import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import Logout from "./Logout";
import profile from "../../../assets/images/profile/17.jpg";
import { authStore } from "../../store/authStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Header = () => {
  const { currentUser } = authStore();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "en");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

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
                    <Dropdown.Item onClick={() => changeLanguage("en")}>
                      EN
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLanguage("fr")}>
                      FR
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              {/* ... rest of your code ... */}
              <Dropdown
                className="nav-item dropdown notification_dropdown"
                as="li"
              >
                {/* ... unchanged ... */}
                <Dropdown.Menu align="end" className="mt-2">
                  <div className="widget-media dz-scroll p-3 height380 ps">
                    <ul className="timeline">{/* ... unchanged ... */}</ul>
                  </div>
                  <Link className="all-notification" to="#">
                    {t("see_all_notifications")}{" "}
                    <i className="ti-arrow-right" />
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
              {/* ... rest of your Dropdowns ... */}
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
                    {/* ...svg... */}
                    <span className="ms-2">{t("profile")}</span>
                  </Link>
                  <Link to="/email-inbox" className="dropdown-item ai-icon">
                    {/* ...svg... */}
                    <span className="ms-2">{t("inbox")}</span>
                  </Link>
                  <Logout />
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
