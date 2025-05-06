import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_HOST, BACKEND_PORT } from "../config";

const PublicCategoryPage = () => {
  const { menuId } = useParams();
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!menuId) {
      setError("❌ Aucune ID de menu détectée. Vérifie ton QR code.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const menuRes = await fetch(
          `http://${BACKEND_HOST}:${BACKEND_PORT}/menu/${menuId}`
        );
        if (!menuRes.ok) throw new Error("Failed to fetch menu");
        const menuData = await menuRes.json();
        setMenu(menuData);

        const catRes = await fetch(
          `http://${BACKEND_HOST}:${BACKEND_PORT}/category/menu/${menuId}`
        );
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const catData = await catRes.json();

        // Fetch products for each category
        const categoriesWithProducts = await Promise.all(
          catData.map(async (category) => {
            const prodRes = await fetch(
              `http://${BACKEND_HOST}:${BACKEND_PORT}/product/category/${category._id}`
            );
            const products = prodRes.ok ? await prodRes.json() : [];
            return { ...category, products };
          })
        );

        setCategories(categoriesWithProducts);
      } catch (err) {
        console.error("Erreur de chargement :", err);
        setError(
          "❌ Erreur lors du chargement des données. Vérifie ton backend ou l'adresse IP."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menuId]);

  if (loading) return <p className="p-6 text-lg">⏳ Chargement...</p>;
  if (error) return <p className="p-6 text-red-500 text-lg">{error}</p>;

  return (
    <div className="font-sans px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-2">
        🍽️ {menu?.name || "Menu"}
      </h1>
      {menu?.description && (
        <p className="text-center text-gray-600 mb-6">{menu.description}</p>
      )}
      {menu?.photo && (
        <div className="flex justify-center mb-6">
          <img
            src={`http://${BACKEND_HOST}:${BACKEND_PORT}${menu.photo}`}
            alt={menu.name}
            className="w-60 h-auto rounded-xl shadow-lg"
          />
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
        📂 Catégories
      </h2>
      {categories.length > 0 ? (
        <div className="space-y-10">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {cat.libelle}
              </h3>
              <p className="text-gray-500 mb-4">
                {cat.description || "Sans description"}
              </p>

              {cat.products?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {cat.products.map((prod) => (
                    <div
                      key={prod._id}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white transition"
                    >
                      {prod.photo && (
                        <img
                          src={`http://${BACKEND_HOST}:${BACKEND_PORT}${prod.photo}`}
                          alt={prod.name}
                          className="w-full h-40 object-cover rounded-md mb-3"
                        />
                      )}
                      <h4 className="text-lg font-medium text-gray-800">
                        {prod.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {prod.description || "Pas de description"}
                      </p>
                      <p className="mt-2 text-green-500 font-bold">
                        ${prod.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Aucun produit pour cette catégorie.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune catégorie disponible.</p>
      )}
    </div>
  );
};

export default PublicCategoryPage;
