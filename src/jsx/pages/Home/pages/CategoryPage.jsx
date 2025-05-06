import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import BlurContainer from "../components/blurContainer";
import { BACKEND_HOST, BACKEND_PORT } from "../config";
import html2pdf from "html2pdf.js";

const CategoryPage = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [direction, setDirection] = useState(1);
  const printRef = useRef();
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/category/menu/${menuId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        if (data.length > 0 && data[0].photo) {
          setMainImage(data[0].photo);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories");
        setLoading(false);
      });
  }, [menuId]);

  const handleHover = (newImage) => {
    if (newImage !== mainImage) {
      setDirection(newImage > mainImage ? 1 : -1);
      setMainImage(newImage);
    }
  };

  const handleImageClick = (categoryId) => {
    navigate(`/products/${categoryId}`);
  };

  const handleExportPDF = () => {
    setShowPreview(true);
  };

  const confirmDownload = () => {
    const element = printRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `menu-${menuId}-details.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
    setShowPreview(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <div className="relative min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl pt-8">
          <BlurContainer
            blur="xl"
            opacity={50}
            padding={8}
            rounded="2xl"
            className="w-full mx-auto p-6"
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={handleExportPDF}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow"
              >
                📄 Export PDF
              </button>
            </div>

            <div className="flex flex-col space-y-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                <div className="flex flex-col space-y-6 md:w-1/2 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-bold text-white">
                    Explore Our Categories
                  </h1>
                  <p className="text-lg text-white">
                    Discover the variety of categories within your selected
                    menu. Browse and enjoy a tailored dining experience.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <Button
                      onClick={() => navigate("/Menus")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-all"
                    >
                      Back to menus
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center overflow-hidden">
                  {mainImage ? (
                    <motion.img
                      key={mainImage}
                      src={`http://${BACKEND_HOST}:${BACKEND_PORT}${mainImage}`}
                      alt="Category Preview"
                      className="w-3/4 max-w-sm rounded-xl object-contain cursor-pointer"
                      initial={{ x: direction * 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -direction * 100, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      onError={(e) => (e.target.src = "/fallback-image.png")}
                      onClick={() =>
                        handleImageClick(
                          categories.find((c) => c.photo === mainImage)?._id
                        )
                      }
                    />
                  ) : (
                    <div className="w-3/4 max-w-sm h-64 flex items-center justify-center bg-gray-200 rounded-xl">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {loading ? (
                  <div className="col-span-full text-center text-white">
                    Loading categories...
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center text-red-500">
                    {error}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="col-span-full text-center text-white">
                    No categories available for this menu
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category._id}
                      className="bg-black/10 rounded-xl p-4 backdrop-blur-sm group hover:bg-black/20 transition-all flex flex-col items-center text-center"
                      onMouseEnter={() => handleHover(category.photo)}
                    >
                      <div className="w-full aspect-square relative flex justify-center items-center">
                        {category.photo ? (
                          <img
                            src={`http://${BACKEND_HOST}:${BACKEND_PORT}${category.photo}`}
                            alt={category.libelle}
                            className="w-full h-full object-cover rounded-lg cursor-pointer"
                            onError={(e) =>
                              (e.target.src = "/fallback-image.png")
                            }
                            onClick={() => handleImageClick(category._id)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                            <p className="text-gray-500">No image</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium text-white">
                          {category.libelle}
                        </p>
                        <p className="text-sm text-white">
                          {category.description || "Description not available"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">PDF Preview</h2>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-red-500 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>
                  <div ref={printRef} className="text-black">
                    <h1 className="text-2xl font-bold mb-4">
                      📋 Menu & Categories Overview
                    </h1>
                    <div className="mb-6">
                      {mainImage && (
                        <img
                          src={`http://${BACKEND_HOST}:${BACKEND_PORT}${mainImage}`}
                          alt="Main Menu"
                          className="w-64 rounded shadow mb-4"
                          crossOrigin="anonymous"
                        />
                      )}
                    </div>
                    <div>
                      {loading ? (
                        <p>Loading...</p>
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : categories.length === 0 ? (
                        <p>No categories available.</p>
                      ) : (
                        categories.map((category) => (
                          <div key={category._id} className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">
                              📂 {category.libelle}
                            </h3>
                            <p className="mb-2 text-sm">
                              {category.description || "No description"}
                            </p>
                            {category.photo && (
                              <img
                                src={`http://${BACKEND_HOST}:${BACKEND_PORT}${category.photo}`}
                                alt={category.libelle}
                                className="w-48 h-auto rounded mb-3"
                                crossOrigin="anonymous"
                              />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="text-right mt-4">
                    <button
                      onClick={confirmDownload}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      ✅ Export PDF Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </BlurContainer>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
