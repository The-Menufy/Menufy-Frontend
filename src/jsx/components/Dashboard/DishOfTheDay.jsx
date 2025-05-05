import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  FormControl,
  Pagination,
  Alert,
} from "react-bootstrap";
import { Plus, Pencil, Trash, Eye } from "react-bootstrap-icons";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const DishOfTheDay = () => {
  const [dishes, setDishes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newDish, setNewDish] = useState({
    date: "",
    statut: "Active",
    productFK: "",
  });

  const fetchDishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/dish`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch dishes: ${errorText}`);
      }
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND}/product`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch products: ${errorText}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchDishes();
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleAddDish = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/dish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDish),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add dish: ${errorText}`);
      }
      await fetchDishes();
      setShowAddModal(false);
      setNewDish({ date: "", statut: "Active", productFK: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDish = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/dish/${selectedDish._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedDish),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update dish: ${errorText}`);
      }
      await fetchDishes();
      setShowEditModal(false);
      setSelectedDish(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/dish/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete dish: ${errorText}`);
      }
      await fetchDishes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (dish) => {
    setSelectedDish({
      ...dish,
      date: dish.date.split("T")[0],
      productFK: dish.productFK?._id || dish.productFK,
    });
    setShowEditModal(true);
  };

  const openViewModal = (dish) => {
    setSelectedDish(dish);
    setShowViewModal(true);
  };

  const filtered = dishes.filter(
    (d) =>
      d.statut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.productFK?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.productFK?.recipeFK?.nom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDishes = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const getPopularProductName = () => {
    const count = {};
    dishes.forEach((d) => {
      const productName = d.productFK?.name;
      if (productName) {
        count[productName] = (count[productName] || 0) + 1;
      }
    });

    let max = 0;
    let popular = "N/A";
    for (const name in count) {
      if (count[name] > max) {
        max = count[name];
        popular = name;
      }
    }
    return popular;
  };

  // Helper to build full image/video URL from relative path
  const getMediaUrl = (media) =>
    media
      ? BACKEND + (media.startsWith("/") ? media : `/${media}`)
      : "https://via.placeholder.com/100?text=Image+Not+Found";

  return (
    <div className="container-fluid p-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex flex-column align-items-start gap-2">
            <h5>Dish of the Day</h5>
            <Button
              style={{ backgroundColor: "#28A745", borderColor: "#28A745" }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus /> Add
            </Button>
            <div className="text-muted">
              Popular product: <strong>{getPopularProductName()}</strong>
            </div>
          </div>
          <div className="d-flex gap-2">
            <FormControl
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <Spinner animation="border" />
          ) : currentDishes.length === 0 ? (
            <p>No dishes available.</p>
          ) : (
            <>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Product</th>
                    <th>Recipe Name</th>
                    <th>Preparation Time (min)</th>
                    <th>Cooking Time (min)</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDishes.map((dish) => (
                    <tr key={dish._id}>
                      <td>{new Date(dish.date).toLocaleDateString()}</td>
                      <td>{dish.statut}</td>
                      <td>{dish.productFK?.name || "N/A"}</td>
                      <td>{dish.productFK?.recipeFK?.nom || "N/A"}</td>
                      <td>
                        {dish.productFK?.recipeFK?.temps_preparation || "N/A"}
                      </td>
                      <td>
                        {dish.productFK?.recipeFK?.temps_cuisson || "N/A"}
                      </td>
                      <td>{dish.productFK?.categoryFK?.libelle || "N/A"}</td>
                      <td>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#007BFF",
                            borderColor: "#007BFF",
                          }}
                          onClick={() => openViewModal(dish)}
                        >
                          <Eye />
                        </Button>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#FFD600",
                            borderColor: "#FFD600",
                          }}
                          className="ms-2"
                          onClick={() => openEditModal(dish)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#FF0000",
                            borderColor: "#FF0000",
                          }}
                          className="ms-2"
                          onClick={() => handleDeleteDish(dish._id)}
                        >
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="justify-content-center">
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Dish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newDish.date}
                onChange={(e) =>
                  setNewDish({ ...newDish, date: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={newDish.statut}
                onChange={(e) =>
                  setNewDish({ ...newDish, statut: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Select
                value={newDish.productFK}
                onChange={(e) =>
                  setNewDish({ ...newDish, productFK: e.target.value })
                }
                required
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddDish} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Dish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDish && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDish.date}
                  onChange={(e) =>
                    setSelectedDish({ ...selectedDish, date: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedDish.statut}
                  onChange={(e) =>
                    setSelectedDish({
                      ...selectedDish,
                      statut: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product</Form.Label>
                <Form.Select
                  value={selectedDish.productFK}
                  onChange={(e) =>
                    setSelectedDish({
                      ...selectedDish,
                      productFK: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateDish}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>View Dish Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDish && (
            <div>
              <h5>Basic Information</h5>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedDish.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedDish.statut}
              </p>
              <p>
                <strong>Product:</strong>{" "}
                {selectedDish.productFK?.name || "N/A"}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {selectedDish.productFK?.categoryFK?.libelle || "N/A"}
              </p>

              {selectedDish.productFK?.recipeFK && (
                <>
                  <h5 className="mt-4">Recipe Details</h5>
                  <p>
                    <strong>Recipe Name:</strong>{" "}
                    {selectedDish.productFK.recipeFK.nom || "N/A"}
                  </p>
                  <p>
                    <strong>Preparation Time:</strong>{" "}
                    {selectedDish.productFK.recipeFK.temps_preparation || "N/A"}{" "}
                    minutes
                  </p>
                  <p>
                    <strong>Cooking Time:</strong>{" "}
                    {selectedDish.productFK.recipeFK.temps_cuisson || "N/A"}{" "}
                    minutes
                  </p>

                  <h6 className="mt-3">Ingredients</h6>
                  {selectedDish.productFK.recipeFK.ingredientsGroup &&
                  selectedDish.productFK.recipeFK.ingredientsGroup.length >
                    0 ? (
                    selectedDish.productFK.recipeFK.ingredientsGroup.map(
                      (group, index) => (
                        <div key={index} className="mb-3">
                          <h6>{group.title || "Group " + (index + 1)}</h6>
                          <ul>
                            {group.items.map((item, idx) => (
                              <li key={idx}>
                                {item.ingredient?.libelle ||
                                  "Unknown Ingredient"}
                                : {item.customQuantity || "N/A"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )
                  ) : (
                    <p>No ingredients available.</p>
                  )}

                  <h6 className="mt-3">Steps</h6>
                  {selectedDish.productFK.recipeFK.steps &&
                  selectedDish.productFK.recipeFK.steps.length > 0 ? (
                    <ol>
                      {selectedDish.productFK.recipeFK.steps.map(
                        (step, idx) => (
                          <li key={idx}>
                            <strong>{step.title || "Step " + (idx + 1)}</strong>
                            : {step.description || "N/A"}
                          </li>
                        )
                      )}
                    </ol>
                  ) : (
                    <p>No steps available.</p>
                  )}

                  <h6 className="mt-3">Utensils</h6>
                  {selectedDish.productFK.recipeFK.utensils &&
                  selectedDish.productFK.recipeFK.utensils.length > 0 ? (
                    <ul>
                      {selectedDish.productFK.recipeFK.utensils.map(
                        (utensil, idx) => (
                          <li key={idx}>
                            {utensil.libelle || "Unknown Utensil"} (Quantity:{" "}
                            {utensil.quantity || "N/A"}, Disponibility:{" "}
                            {utensil.disponibility
                              ? "Available"
                              : "Not Available"}
                            )
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No utensils required.</p>
                  )}

                  <h6 className="mt-3">Images</h6>
                  {selectedDish.productFK.recipeFK.images &&
                  selectedDish.productFK.recipeFK.images.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedDish.productFK.recipeFK.images.map(
                        (image, idx) => (
                          <img
                            key={idx}
                            src={getMediaUrl(image)}
                            alt={`Recipe Image ${idx + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/100?text=Image+Not+Found")
                            }
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <p>No images available.</p>
                  )}

                  <h6 className="mt-3">Video</h6>
                  {selectedDish.productFK.recipeFK.video ? (
                    <video
                      src={getMediaUrl(selectedDish.productFK.recipeFK.video)}
                      controls
                      style={{ maxWidth: "100%" }}
                      onError={(e) =>
                        (e.target.nextSibling.style.display = "block")
                      }
                    />
                  ) : (
                    <p>No video available.</p>
                  )}
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DishOfTheDay;
