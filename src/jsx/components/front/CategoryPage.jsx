import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import BlurContainer from "../components/blurContainer";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const CategoryPage = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetch(`${BACKEND}/category/menu/${menuId}`)
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

  // Handle click on category photo to navigate to ProductPage
  const handleImageClick = (categoryId) => {
    navigate(`/products/${categoryId}`);
  };

  // Helper for image URLs
  const getPhotoUrl = (photo) =>
    photo
      ? BACKEND + (photo.startsWith("/") ? photo : `/${photo}`)
      : "/fallback-image.png";

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
                      src={getPhotoUrl(mainImage)}
                      alt="Category Preview"
                      className="w-3/4 max-w-sm rounded-xl object-contain cursor-pointer"
                      initial={{ x: direction * 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -direction * 100, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      onError={(e) => (e.target.src = "/fallback-image.png")}
                      onClick={() => {
                        // find the category with this mainImage
                        const found = categories.find(
                          (c) => c.photo === mainImage
                        );
                        if (found) handleImageClick(found._id);
                      }}
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
                            src={getPhotoUrl(category.photo)}
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
          </BlurContainer>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
