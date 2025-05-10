import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  InputGroup,
  FormControl,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  Pencil,
  Trash,
  Eye,
  ArrowUp,
  ArrowDown,
  MicFill,
} from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [nutritionResult, setNutritionResult] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [listening, setListening] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productRes, ingredientRes, categoryRes] = await Promise.all([
        fetch(`${BACKEND}/product`),
        fetch(`${BACKEND}/ingredient`),
        fetch(`${BACKEND}/category`),
      ]);

      if (!productRes.ok) throw new Error("Failed to fetch products");
      if (!ingredientRes.ok) throw new Error("Failed to fetch ingredients");
      if (!categoryRes.ok) throw new Error("Failed to fetch categories");

      const productData = await productRes.json();
      const ingredientData = await ingredientRes.json();
      const categoryData = await categoryRes.json();

      setProducts(productData);
      setIngredients(ingredientData);
      setCategoryOptions(categoryData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const fields = {
        name: selectedProduct.name,
        price: selectedProduct.price,
        description: selectedProduct.description,
        promotion: selectedProduct.promotion,
        disponibility: selectedProduct.disponibility,
        duration: selectedProduct.duration,
        typePlat: selectedProduct.typePlat,
        archived: selectedProduct.archived,
      };
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      formData.append(
        "categoryFK",
        selectedProduct.categoryFK?._id || selectedProduct.categoryFK
      );
      if (selectedProduct.photo instanceof File) {
        formData.append("photo", selectedProduct.photo);
      }

      const res = await fetch(`${BACKEND}/product/${selectedProduct._id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());

      await fetchProducts();
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (err) {
      alert("Error updating product: " + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(`${BACKEND}/product/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchProducts();
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
      if (currentPage > totalPages) setCurrentPage(totalPages || 1);
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  const handleArchiveProduct = async (id) => {
    if (!window.confirm("Voulez-vous archiver ce produit ?")) return;
    try {
      const res = await fetch(`${BACKEND}/product/${id}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur d'archivage");
      await fetchProducts();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleRestoreProduct = async (id) => {
    if (!window.confirm("Voulez-vous restaurer ce produit ?")) return;
    try {
      const res = await fetch(`${BACKEND}/product/${id}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur de restauration");
      await fetchProducts();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const translateIngredientToEnglish = (name) => {
    if (!name) return "Unknown";
    const translations = {
      "Fromage râpé": "grated cheese",
      Farine: "flour",
      Sucre: "sugar",
      Oeuf: "egg",
      Lait: "milk",
      Beurre: "butter",
      Sel: "salt",
      Tomate: "tomato",
      Viande: "beef",
      Pâtes: "pasta",
      Spaghetti: "spaghetti",
      Poulet: "chicken",
      Poivron: "pepper",
      Riz: "rice",
      Thon: "tuna",
      Saumon: "salmon",
      Citron: "lemon",
      Banane: "banana",
      Pomme: "apple",
      Oignon: "onion",
      Ail: "garlic",
      Laitue: "lettuce",
      Carotte: "carrot",
      "Fromage blanc": "cottage cheese",
    };
    const normalized = name.trim().toLowerCase();
    const found = Object.entries(translations).find(
      ([fr]) => fr.toLowerCase() === normalized
    );
    return found ? found[1] : "Unknown";
  };

  const handleAnalyzeNutrition = async (product) => {
    try {
      if (!product.recipeFK || !product.recipeFK._id) {
        alert("Ce produit n'a pas de recette associée ou l'ID est manquant !");
        return;
      }

      const res = await fetch(`${BACKEND}/recipe/${product.recipeFK._id}`);
      if (!res.ok) throw new Error("Échec de récupération de la recette");
      const recipe = await res.json();

      const ingredientsList = [];
      recipe.ingredientsGroup.forEach((group) => {
        group.items.forEach((item) => {
          if (item.ingredient && item.customQuantity) {
            let ingredientName = "";
            if (
              typeof item.ingredient === "object" &&
              (item.ingredient.libelle || item.ingredient.name)
            ) {
              ingredientName = item.ingredient.libelle || item.ingredient.name;
            } else {
              const foundIngredient = ingredients.find(
                (ing) =>
                  ing._id === item.ingredient ||
                  ing._id === item.ingredient?._id
              );
              ingredientName =
                foundIngredient?.libelle || foundIngredient?.name || "";
            }
            const translatedName = translateIngredientToEnglish(ingredientName);
            if (translatedName !== "Unknown") {
              ingredientsList.push(`${translatedName} ${item.customQuantity}`);
            }
          }
        });
      });

      if (ingredientsList.length === 0) {
        alert("Aucun ingrédient valide pour l'analyse nutritionnelle !");
        return;
      }

      const nutritionRes = await fetch(`${BACKEND}/nutrition/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientsList }),
      });

      if (!nutritionRes.ok) throw new Error(await nutritionRes.text());
      const result = await nutritionRes.json();
      setNutritionResult(result);
      setSelectedProductName(product.name);
      setShowNutritionModal(true);
    } catch (err) {
      console.error("Erreur analyse nutrition:", err.message);
      alert("Erreur lors de l'analyse nutritionnelle : " + err.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "La reconnaissance vocale n'est pas supportée par votre navigateur."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript.trim();
      transcript = transcript.replace(/[.,!?؛؟]+$/, "");
      transcript = transcript.charAt(0).toLowerCase() + transcript.slice(1);
      setSearchTerm(transcript);
      setCurrentPage(1);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale :", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ArrowUp /> : <ArrowDown />;
  };

  const getPhotoUrl = (photo) =>
    photo || "https://via.placeholder.com/50"; // Use Cloudinary URL directly

  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchArchived = showArchived ? p.archived : !p.archived;
      return matchSearch && matchArchived;
    })
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "categoryFK") {
        aValue = a.categoryFK?.libelle || "";
        bValue = b.categoryFK?.libelle || "";
      } else if (sortConfig.key === "price") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      } else if (
        sortConfig.key === "disponibility" ||
        sortConfig.key === "archived"
      ) {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
      aValue = aValue ? aValue.toString().toLowerCase() : "";
      bValue = bValue ? bValue.toString().toLowerCase() : "";
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  const styles = `
    :root {
      --primary-color: #28A745;
      --secondary-color: #007BFF;
      --danger-color: #DC3545;
      --warning-color: #FFC107;
      --info-color: #17A2B8;
      --light-gray: #F8F9FA;
      --dark-gray: #343A40;
      --border-radius: 8px;
      --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card {
      border: none;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      transition: transform 0.2s;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .table {
      background-color: #fff;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--box-shadow);
    }

    .table th {
      background-color: var(--light-gray);
      color: var(--dark-gray);
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .table th:hover {
      background-color: #e9ecef;
    }

    .table td {
      vertical-align: middle;
    }

    .table img {
      border: 1px solid #ddd;
      border-radius: 5px;
      transition: transform 0.2s;
    }

    .table img:hover {
      transform: scale(1.1);
    }

    .btn-custom {
      border-radius: var(--border-radius);
      padding: 8px 16px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-custom:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    .btn-add {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    .btn-cost {
      background-color: var(--dark-gray);
      border-color: var(--dark-gray);
      color: #fff;
    }

    .btn-view {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);
    }

    .btn-edit {
      background-color: var(--warning-color);
      border-color: var(--warning-color);
      color: #212529;
    }

    .btn-archive, .btn-restore {
      background-color: #6c757d;
      border-color: #6c757d;
    }

    .btn-restore {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    .btn-delete {
      background-color: var(--danger-color);
      border-color: var(--danger-color);
    }

    .btn-nutrition {
      background-color: var(--info-color);
      border-color: var(--info-color);
    }

    .btn-voice {
      transition: all 0.3s ease;
    }

    .btn-voice.listening {
      background-color: var(--danger-color) !important;
      border-color: var(--danger-color) !important;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }

    .form-control, .form-select {
      border-radius: var(--border-radius);
      border: 1px solid #ced4da;
      transition: border-color 0.3s;
    }

    .form-control:focus, .form-select:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 5px rgba(40, 167, 69, 0.3);
    }

    .form-label {
      font-weight: 500;
      color: var(--dark-gray);
    }

    .modal-header {
      border-bottom: 2px solid #ddd;
    }

    .modal-title {
      font-weight: 600;
    }

    .modal-body {
      padding: 20px;
    }

    .modal-img {
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .badge {
      font-size: 0.9rem;
      padding: 5px 10px;
      border-radius: var(--border-radius);
    }

    @media (max-width: 768px) {
      .table-responsive {
        font-size: 0.85rem;
      }
      .table img {
        width: 40px;
        height: 40px;
      }
      .table td, .table th {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
      }
      .action-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
      }
      .action-buttons .btn {
        font-size: 0.8rem;
        padding: 0.3rem;
        margin: 0 !important;
      }
      .modal-img {
        width: 80px;
        height: 80px;
        display: block;
        margin: 0 auto;
      }
      .hide-on-mobile {
        display: none !important;
      }
      .card-header .d-flex:last-child .input-group {
        max-width: 200px;
      }
    }

    @media (max-width: 576px) {
      .action-buttons .btn {
        width: 100%;
      }
      .pagination {
        flex-wrap: wrap;
        font-size: 0.9rem;
      }
      .pagination .page-item {
        margin: 0.2rem;
      }
      .card-header .d-flex:last-child .input-group {
        max-width: 150px;
      }
    }
  `;

  return (
    <div className="container-fluid p-4">
      <style>{styles}</style>
      <Card>
        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="mb-3 fw-bold">Product List</h5>
            <div className="d-flex flex-wrap gap-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Add a new product & recipe</Tooltip>}
              >
                <Button
                  className="btn-custom btn-add"
                  onClick={() => navigate("/add-product")}
                >
                  <span className="fw-semibold">➕ Add Product & Recipe</span>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Track recipe costs</Tooltip>}
              >
                <Button
                  className="btn-custom btn-cost"
                  onClick={() => navigate("/RecipeCostDetails")}
                >
                  💸 Track Recipe Costs
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Show active products</Tooltip>}
              >
                <Button
                  variant={!showArchived ? "primary" : "outline-secondary"}
                  className="btn-custom"
                  onClick={() => {
                    setShowArchived(false);
                    setCurrentPage(1);
                  }}
                >
                  Actives
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Show archived products</Tooltip>}
              >
                <Button
                  variant={showArchived ? "primary" : "outline-secondary"}
                  className="btn-custom"
                  onClick={() => {
                    setShowArchived(true);
                    setCurrentPage(1);
                  }}
                >
                  Archivés
                </Button>
              </OverlayTrigger>
            </div>
          </div>
          <div className="d-flex align-items-center w-100 w-md-auto mt-3 mt-md-0">
            <InputGroup style={{ maxWidth: "350px", marginLeft: "auto" }}>
              <FormControl
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Recherche vocale</Tooltip>}
              >
                <Button
                  variant={listening ? "danger" : "secondary"}
                  onClick={handleVoiceSearch}
                  className={`btn-voice ${listening ? "listening" : ""}`}
                >
                  <MicFill />
                </Button>
              </OverlayTrigger>
            </InputGroup>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center">
              No products match your search. Click <b>Add Product and Recipe</b>{" "}
              to create one.
            </p>
          ) : (
            <>
              <Table responsive bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th onClick={() => handleSort("name")}>
                      Name {getSortIcon("name")}
                    </th>
                    <th onClick={() => handleSort("price")}>
                      Price {getSortIcon("price")}
                    </th>
                    <th onClick={() => handleSort("typePlat")} className="hide-on-mobile">
                      Type of Dish {getSortIcon("typePlat")}
                    </th>
                    <th onClick={() => handleSort("description")} className="hide-on-mobile">
                      Description {getSortIcon("description")}
                    </th>
                    <th onClick={() => handleSort("categoryFK")}>
                      Category {getSortIcon("categoryFK")}
                    </th>
                    <th onClick={() => handleSort("archived")}>
                      Archived {getSortIcon("archived")}
                    </th>
                    <th>Recipe</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        {prod.photo ? (
                          <img
                            src={getPhotoUrl(prod.photo)}
                            alt={prod.name || "Product"}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/50")
                            }
                          />
                        ) : (
                          <span className="text-muted">No photo</span>
                        )}
                      </td>
                      <td className="fw-semibold">{prod.name || "N/A"}</td>
                      <td>${prod.price?.toFixed(2) ?? "N/A"}</td>
                      <td className="hide-on-mobile">{prod.typePlat || "N/A"}</td>
                      <td className="hide-on-mobile">{prod.description || "N/A"}</td>
                      <td>{prod.categoryFK?.libelle || "No category"}</td>
                      <td>
                        <span
                          className={`badge ${
                            prod.archived ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {prod.archived ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        {prod.recipeFK ? (
                          <Button
                            size="sm"
                            variant="info"
                            as={Link}
                            to={`/recipe/${prod.recipeFK._id}`}
                          >
                            View Recipe
                          </Button>
                        ) : (
                          <span className="text-muted">No Recipe</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons d-flex flex-row flex-wrap gap-2">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View product details</Tooltip>}
                          >
                            <Button
                              size="sm"
                              className="btn-custom btn-view"
                              onClick={() => {
                                setSelectedProduct(prod);
                                setShowViewModal(true);
                              }}
                            >
                              <Eye />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Edit product</Tooltip>}
                          >
                            <Button
                              size="sm"
                              className="btn-custom btn-edit"
                              onClick={() => {
                                setSelectedProduct({ ...prod, photo: null });
                                setShowEditModal(true);
                              }}
                            >
                              <Pencil />
                            </Button>
                          </OverlayTrigger>
                          {showArchived ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Restore product</Tooltip>}
                            >
                              <Button
                                size="sm"
                                className="btn-custom btn-restore"
                                onClick={() => handleRestoreProduct(prod._id)}
                              >
                                🔄
                              </Button>
                            </OverlayTrigger>
                          ) : (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Archive product</Tooltip>}
                            >
                              <Button
                                size="sm"
                                className="btn-custom btn-archive"
                                onClick={() => handleArchiveProduct(prod._id)}
                              >
                                🗄️
                              </Button>
                            </OverlayTrigger>
                          )}
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Delete product</Tooltip>}
                          >
                            <Button
                              size="sm"
                              className="btn-custom btn-delete"
                              onClick={() => handleDeleteProduct(prod._id)}
                            >
                              <Trash />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Analyze nutrition</Tooltip>}
                          >
                            <Button
                              size="sm"
                              className={`btn-custom ${prod.recipeFK ? "btn-nutrition" : "btn-secondary"}`}
                              disabled={!prod.recipeFK}
                              onClick={() => handleAnalyzeNutrition(prod)}
                            >
                              📊
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {renderPagination()}
            </>
          )}
        </Card.Body>
      </Card>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p>
                <strong>Photo:</strong>{" "}
                {selectedProduct.photo ? (
                  <img
                    src={getPhotoUrl(selectedProduct.photo)}
                    alt={selectedProduct.name || "Product Photo"}
                    className="modal-img"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/100")
                    }
                  />
                ) : (
                  "No photo available"
                )}
              </p>
              <p>
                <strong>Name:</strong> {selectedProduct.name || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> ${selectedProduct.price?.toFixed(2) ?? "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedProduct.description || "N/A"}
              </p>
              <p>
                <strong>Promotion:</strong> {selectedProduct.promotion || "N/A"}
              </p>
              <p>
                <strong>Disponibility:</strong>{" "}
                {selectedProduct.disponibility ? "Yes" : "No"}
              </p>
              <p>
                <strong>Duration:</strong> {selectedProduct.duration || "N/A"}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {selectedProduct.categoryFK?.libelle || "No category"}
              </p>
              <p>
                <strong>Type of Dish:</strong> {selectedProduct.typePlat || "N/A"}
              </p>
              <p>
                <strong>Archived:</strong>{" "}
                {selectedProduct.archived ? "Yes" : "No"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn-custom"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form onSubmit={handleUpdateProduct}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.name || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                {selectedProduct.photo &&
                  typeof selectedProduct.photo === "string" && (
                    <div className="mb-2">
                      <img
                        src={getPhotoUrl(selectedProduct.photo)}
                        alt="Current"
                        className="modal-img"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/100")
                        }
                      />
                    </div>
                  )}
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      photo: e.target.files[0],
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={selectedProduct.price ?? ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.description || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Promotion</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.promotion || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      promotion: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Disponibility</Form.Label>
                <Form.Select
                  value={selectedProduct.disponibility ? "true" : "false"}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      disponibility: e.target.value === "true",
                    })
                  }
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.duration || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      duration: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type of Dish</Form.Label>
                <Form.Select
                  value={selectedProduct.typePlat || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      typePlat: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select type</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="dairy-free">Dairy-Free</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={
                    selectedProduct.categoryFK?._id ||
                    selectedProduct.categoryFK ||
                    ""
                  }
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      categoryFK: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.libelle}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  className="btn-custom"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" className="btn-custom" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Nutrition Modal */}
      <Modal
        show={showNutritionModal}
        onHide={() => setShowNutritionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nutrition Facts for {selectedProductName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {nutritionResult ? (
            <ul className="list-unstyled">
              <li className="mb-2">
                <strong>Calories:</strong>{" "}
                {Math.round(nutritionResult.calories)} kcal
              </li>
              <li className="mb-2">
                <strong>Protein:</strong> {nutritionResult.protein.toFixed(1)} g
              </li>
              <li className="mb-2">
                <strong>Fat:</strong> {nutritionResult.fat.toFixed(1)} g
              </li>
              <li className="mb-2">
                <strong>Carbs:</strong> {nutritionResult.carbs.toFixed(1)} g
              </li>
              <li className="mb-2">
                <strong>Tags:</strong>{" "}
                {nutritionResult.tags.map((tag, idx) => (
                  <span key={idx} className="badge bg-info me-1">
                    {tag}
                  </span>
                ))}
              </li>
            </ul>
          ) : (
            <p>No data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn-custom"
            onClick={() => setShowNutritionModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Product;