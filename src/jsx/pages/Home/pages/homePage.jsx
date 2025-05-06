import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BACKEND_HOST, BACKEND_PORT } from "../config";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [direction, setDirection] = useState(1);
  const [typePlatFilter, setTypePlatFilter] = useState("all");
  const [typePlatOptions, setTypePlatOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/product`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        const uniqueTypePlats = [
          ...new Set(data.map((product) => product.typePlat)),
        ];
        setTypePlatOptions(uniqueTypePlats);
        if (data.length > 0 && data[0].photo) {
          setMainImage(
            `http://${BACKEND_HOST}:${BACKEND_PORT}${data[0].photo}`
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = products;
    if (typePlatFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.typePlat === typePlatFilter
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [typePlatFilter, searchQuery, products]);

  const handleHover = (newImage) => {
    if (newImage !== mainImage) {
      setDirection(newImage > mainImage ? 1 : -1);
      setMainImage(newImage);
    }
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
      />{" "}
      <div
        className="position-relative min-vh-100 d-flex flex-column align-items-center justify-content-center py-4 px-2"
        style={{ zIndex: 1 }}
      >
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
                  <Link
                    to="/MenuPage"
                    className="btn btn-warning btn-lg fw-semibold shadow"
                  >
                    See menu
                  </Link>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                {mainImage ? (
                  <motion.img
                    key={mainImage}
                    src={mainImage}
                    alt="Product Preview"
                    className="img-fluid rounded-4 shadow"
                    style={{
                      width: "70%",
                      maxWidth: 320,
                      objectFit: "contain",
                      background: "#fff2",
                    }}
                    initial={{ x: direction * 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -direction * 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    onError={(e) => (e.target.src = "/fallback-image.png")}
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

            {/* Filters */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-8">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by dish name..."
                  className="form-control bg-light text-dark border-0 rounded-3"
                />
              </div>
              <div className="col-12 col-sm-4">
                <select
                  value={typePlatFilter}
                  onChange={(e) => setTypePlatFilter(e.target.value)}
                  className="form-select bg-light text-dark border-0 rounded-3"
                >
                  <option value="all">All Types</option>
                  {typePlatOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="row g-4">
              {loading ? (
                <div className="col-12 text-center text-secondary fs-5">
                  Loading products...
                </div>
              ) : error ? (
                <div className="col-12 text-center text-danger fs-5">
                  {error}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-12 text-center text-secondary fs-5">
                  No products available
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="col-12 col-sm-6 col-md-3"
                    onMouseEnter={() =>
                      handleHover(
                        `http://${BACKEND_HOST}:${BACKEND_PORT}${product.photo}`
                      )
                    }
                  >
                    <div className="card bg-light bg-opacity-10  border-0 rounded-4 shadow-sm h-100 text-center">
                      <div className="ratio ratio-1x1 rounded-4 overflow-hidden bg-secondary bg-opacity-25">
                        {product.photo ? (
                          <img
                            src={`http://${BACKEND_HOST}:${BACKEND_PORT}${product.photo}`}
                            alt={product.name}
                            className="w-100 h-100 object-fit-cover rounded-4"
                            style={{ objectFit: "cover" }}
                            onError={(e) =>
                              (e.target.src = "/fallback-image.png")
                            }
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <p className="text-muted">No image</p>
                          </div>
                        )}
                      </div>
                      <div className="card-body p-3">
                        <p className="card-title mb-1 fw-medium text-dark">
                          {product.name}
                        </p>
                        <p className="card-text text-secondary small">
                          ${product.price || "Price not available"}
                        </p>
                        {product.typePlat && (
                          <span className="badge bg-warning text-dark">
                            {product.typePlat}
                          </span>
                        )}
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

export default HomePage;
