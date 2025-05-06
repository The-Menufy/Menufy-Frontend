// 📁 src/pages/ProductPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import BlurContainer from "../components/blurContainer";
import { BACKEND_HOST, BACKEND_PORT } from "../config";

const ProductPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({}); // Store { variantId, portion } per product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://${BACKEND_HOST}:${BACKEND_PORT}/product/category/${categoryId}`
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const handleVariantChange = (productId, variantId) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        variantId,
        // Reset portion when a new variant is selected; default to the first portion if available
        portion:
          prev[productId]?.variantId === variantId
            ? prev[productId].portion
            : null,
      },
    }));
  };

  const handlePortionChange = (productId, portion) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        portion,
      },
    }));
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
      <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-8 lg:px-20">
        <div className="w-full max-w-7xl pt-10">
          <BlurContainer
            blur="xl"
            opacity={50}
            padding={10}
            rounded="3xl"
            className="w-full mx-auto p-8"
          >
            <div className="flex flex-col space-y-12">
              <div className="flex flex-col items-center justify-between gap-10 px-6">
                <div className="flex flex-col space-y-8 text-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-white">
                    Our Products
                  </h1>
                  <p className="text-xl text-white">
                    Explore the delicious products in this category.
                  </p>
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-8 rounded-full"
                    onClick={() =>
                      navigate(
                        `/category/${products[0]?.categoryFK?.menu || ""}`
                      )
                    }
                  >
                    Back to Categories
                  </Button>
                </div>
              </div>

              <div className="flex flex-col space-y-10 px-6">
                {loading ? (
                  <div className="text-center text-white text-lg">
                    Loading products...
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 text-lg">
                    {error}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center text-white text-lg">
                    No products available in this category
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-black/20 rounded-2xl p-8 flex flex-col lg:flex-row items-start gap-8 hover:bg-black/30"
                    >
                      <div className="w-full lg:w-1/4">
                        {product.photo ? (
                          <img
                            src={`http://${BACKEND_HOST}:${BACKEND_PORT}${product.photo}`}
                            alt={product.name}
                            className="w-full h-56 object-cover rounded-xl"
                            onError={(e) =>
                              (e.target.src = "/fallback-image.png")
                            }
                          />
                        ) : (
                          <div className="w-full h-56 flex items-center justify-center bg-gray-200 rounded-xl">
                            <p className="text-gray-500">No image</p>
                          </div>
                        )}
                      </div>

                      <div className="w-full lg:w-3/4 flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-1/2 text-white space-y-4">
                          <h3 className="text-2xl font-semibold text-yellow-300">
                            {product.name}
                          </h3>
                          <p className="text-base text-gray-300">
                            {product.description || "No description"}
                          </p>
                          <p className="text-xl">
                            Price:{" "}
                            <span className="text-green-400">
                              ${product.price || "N/A"}
                            </span>
                          </p>
                          <p>
                            Promotion:{" "}
                            <span className="text-yellow-400">
                              {product.promotion || "None"}
                            </span>
                          </p>
                          <p>
                            Availability:{" "}
                            <span
                              className={
                                product.disponibility === "Available"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {product.disponibility || "N/A"}
                            </span>
                          </p>
                          <p>
                            Duration: <span>{product.duration || "N/A"}</span>
                          </p>
                        </div>

                        {product.recipeFK?.variants?.length > 0 && (
                          <div className="w-full lg:w-1/2 text-white">
                            <h4 className="text-lg font-semibold mb-4 text-yellow-300">
                              Select Variant
                            </h4>
                            <div className="bg-black/40 p-6 rounded-xl max-h-64 overflow-y-auto">
                              {product.recipeFK.variants.map((variant) => (
                                <div
                                  key={variant._id}
                                  className="py-3 border-b border-gray-700 last:border-b-0"
                                >
                                  <label className="flex items-center gap-4">
                                    <input
                                      type="checkbox" // Changed from "ch" to "checkbox"
                                      checked={
                                        selectedVariant[product._id]
                                          ?.variantId === variant._id
                                      }
                                      onChange={() => {
                                        if (
                                          selectedVariant[product._id]
                                            ?.variantId === variant._id
                                        ) {
                                          // Deselect the variant and clear portion
                                          setSelectedVariant((prev) => {
                                            const newState = { ...prev };
                                            delete newState[product._id]; // Remove the product entry entirely
                                            return newState;
                                          });
                                        } else {
                                          // Select the variant
                                          handleVariantChange(
                                            product._id,
                                            variant._id
                                          );
                                        }
                                      }}
                                      className="h-5 w-5 text-yellow-500 border-gray-300 rounded"
                                    />
                                    <div className="flex items-center gap-3">
                                      {variant.images?.[0] && (
                                        <img
                                          src={`http://${BACKEND_HOST}:${BACKEND_PORT}${variant.images[0]}`}
                                          alt={variant.name}
                                          className="w-10 h-10 object-cover rounded-full border-2 border-gray-600"
                                          onError={(e) =>
                                            (e.target.src =
                                              "/fallback-image.png")
                                          }
                                        />
                                      )}
                                      <span>{variant.name}</span>
                                    </div>
                                  </label>
                                  {selectedVariant[product._id]?.variantId ===
                                    variant._id &&
                                    variant.portions?.length > 0 && (
                                      <div className="ml-9 mt-2 space-y-2">
                                        {variant.portions.map((portion) => (
                                          <label
                                            key={portion}
                                            className="flex items-center gap-2"
                                          >
                                            <input
                                              type="radio"
                                              name={`portion-${product._id}-${variant._id}`}
                                              checked={
                                                selectedVariant[product._id]
                                                  ?.portion === portion
                                              }
                                              onChange={() =>
                                                handlePortionChange(
                                                  product._id,
                                                  portion
                                                )
                                              }
                                              className="h-4 w-4 text-yellow-500 border-gray-300 rounded"
                                            />
                                            <span>{portion}</span>
                                          </label>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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

export default ProductPage;
