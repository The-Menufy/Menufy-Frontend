import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { BACKEND_HOST, BACKEND_PORT } from "../config";

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/menu`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMenus(data);
        if (data.length > 0 && data[0].photo) {
          setMainImage(
            `http://${BACKEND_HOST}:${BACKEND_PORT}${data[0].photo}`
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch menus");
        setLoading(false);
      });
  }, []);

  const handleHover = (newImage) => {
    if (newImage !== mainImage) {
      setDirection(newImage > mainImage ? 1 : -1);
      setMainImage(newImage);
    }
  };

  const handleImageClick = (menuId) => {
    navigate(`/category/${menuId}`);
  };

  const renderStarRating = (rate) => {
    const filledStars = Math.round(rate);
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, i) => (
      <span
        key={i}
        className={i < filledStars ? "text-warning" : "text-secondary"}
        style={{ fontSize: "1.2em" }}
      >
        {i < filledStars ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div
      className="min-vh-100 position-relative"
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div className="position-relative min-vh-100 d-flex flex-column align-items-center justify-content-center py-4 px-2">
        <div
          className="w-100"
          style={{ maxWidth: "1200px", paddingTop: "2rem" }}
        >
          <div
            className="bg-white bg-opacity-10 rounded-4 shadow p-4 mx-auto"
            style={{ backdropFilter: "blur(10px)" }}
          >
            {/* Hero Section */}
            <div className="row align-items-center mb-4 g-4">
              <div className="col-md-6 text-center text-md-start">
                <h1 className="display-4 fw-bold text-dark">
                  Welcome to TheMenuFy!
                </h1>
                <p className="lead text-secondary">
                  Manage your restaurant menus with ease and style. Customize,
                  update in real-time, and enhance customer experiences.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 mt-3 justify-content-center justify-content-md-start">
                  <button
                    onClick={() => navigate("/homepage")}
                    className="btn btn-warning btn-lg fw-semibold shadow"
                  >
                    Back to home
                  </button>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                {mainImage ? (
                  <motion.img
                    key={mainImage}
                    src={mainImage}
                    alt="MenuFy Preview"
                    className="img-fluid rounded-4 shadow"
                    style={{
                      width: "70%",
                      maxWidth: 320,
                      objectFit: "contain",
                      background: "#fff2",
                      cursor: "pointer",
                    }}
                    initial={{ x: direction * 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -direction * 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    onError={(e) => (e.target.src = "/fallback-image.png")}
                    onClick={() =>
                      handleImageClick(
                        menus.find(
                          (m) =>
                            `http://${BACKEND_HOST}:${BACKEND_PORT}${m.photo}` ===
                            mainImage
                        )?._id
                      )
                    }
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-25 rounded-4"
                    style={{ width: "70%", maxWidth: 320, height: 220 }}
                  >
                    <p className="text-muted">No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Menus Grid */}
            <div className="row g-4">
              {loading ? (
                <div className="col-12 text-center text-secondary fs-5">
                  Loading menus...
                </div>
              ) : error ? (
                <div className="col-12 text-center text-danger fs-5">
                  {error}
                </div>
              ) : menus.length === 0 ? (
                <div className="col-12 text-center text-secondary fs-5">
                  No menus available
                </div>
              ) : (
                menus.map((item) => (
                  <div
                    key={item._id}
                    className="col-12 col-sm-6 col-md-3"
                    onMouseEnter={() =>
                      handleHover(
                        `http://${BACKEND_HOST}:${BACKEND_PORT}${item.photo}`
                      )
                    }
                  >
                    <div
                      className="bg-white bg-opacity-10 rounded-4 shadow p-4 mx-auto"
                      style={{ backdropFilter: "blur(10px)" }}
                    >
                      <div className="ratio ratio-1x1 rounded-4 overflow-hidden bg-secondary bg-opacity-25">
                        {item.photo ? (
                          <img
                            src={`http://${BACKEND_HOST}:${BACKEND_PORT}${item.photo}`}
                            alt={item.name}
                            className="w-100 h-100 object-fit-cover rounded-4"
                            style={{ objectFit: "cover", cursor: "pointer" }}
                            onError={(e) =>
                              (e.target.src = "/fallback-image.png")
                            }
                            onClick={() => handleImageClick(item._id)}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <p className="text-muted">No image</p>
                          </div>
                        )}
                      </div>

                      <div className="card-body p-3">
                        <p className="card-title mb-1 fw-medium text-dark">
                          {item.name}
                        </p>
                        <p className="card-text text-secondary small">
                          {item.rate !== undefined && item.rate !== null
                            ? renderStarRating(item.rate)
                            : "No rating available"}
                        </p>
                        <div className="mt-3 d-flex justify-content-center">
                          <QRCodeGenerator menuId={item._id} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
