import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { Plus, Eye, Pencil, Trash } from "react-bootstrap-icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const DishOfTheDay = () => {
  const [dishes, setDishes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [updateDishDate, setUpdateDishDate] = useState("");
  const [isRandomAdd, setIsRandomAdd] = useState(false);
  const [randomDishCount, setRandomDishCount] = useState(1);
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
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/product`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch products: ${errorText}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (productId) => {
    try {
      const existingProduct = products.find((p) => p._id === productId);
      if (existingProduct) return existingProduct;

      setLoading(true);
      const res = await fetch(`${BACKEND}/product/${productId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch product with ID ${productId}`);
      }
      const data = await res.json();
      setProducts((prevProducts) => [...prevProducts, data]);
      return data;
    } catch (err) {
      console.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchDishes();
      await fetchProducts();
    };
    loadData();
  }, []);

  const handleAddDish = async () => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (isRandomAdd) {
        // Add random dishes
        res = await fetch(`${BACKEND}/dish/random`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate || newDish.date,
            count: parseInt(randomDishCount),
            statut: newDish.statut,
          }),
        });
      } else {
        // Add single dish
        if (!newDish.date || !newDish.productFK) {
          throw new Error("Date and product are required");
        }
        res = await fetch(`${BACKEND}/dish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDish),
        });
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add dish(es): ${errorText}`);
      }
      await fetchDishes();
      setShowAddModal(false);
      setNewDish({ date: "", statut: "Active", productFK: "" });
      setIsRandomAdd(false);
      setRandomDishCount(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/dish/${dishId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete dish: ${errorText}`);
      }
      await fetchDishes();
      setShowDayModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDish = async () => {
    if (!selectedDish) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/dish/${selectedDish._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selectedDish, date: updateDishDate }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update dish: ${errorText}`);
      }
      await fetchDishes();
      setShowUpdateModal(false);
      setShowDayModal(false);
      setSelectedDish(null);
      setUpdateDishDate("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDishesForDate = (dateStr) => {
    return dishes.filter((dish) => dish.date.startsWith(dateStr));
  };

  const getCalendarEvents = () => {
    const events = [];
    dishes.forEach((dish) => {
      const dateStr = dish.date.split("T")[0];
      const dishName = dish.productFK?.name || "N/A";
      const productId = typeof dish.productFK === "string" ? dish.productFK : dish.productFK?._id;
      events.push({
        id: dish._id,
        title: dishName,
        date: dateStr,
        productId: productId,
      });
    });
    return events;
  };

  const handleEventClick = async (info) => {
    const productId = info.event.extendedProps.productId;
    console.log("Clicked event with productId:", productId);
    console.log("Products array:", products);

    if (!productId) {
      console.error("No productId found for this event");
      return;
    }

    let product = await fetchProductById(productId);

    if (product) {
      console.log("Found product:", product);
      setSelectedProduct(product);
      setShowViewModal(true);
    } else {
      console.error("Product not found for productId:", productId);
      setError(`Product with ID ${productId} not found.`);
    }
  };

  const handleSelect = async (info) => {
    console.log("Selected date:", info.startStr);
    setSelectedDate(info.startStr);

    const dishesForDate = getDishesForDate(info.startStr);
    for (const dish of dishesForDate) {
      const productId = typeof dish.productFK === "string" ? dish.productFK : dish.productFK?._id;
      if (productId && !products.find((p) => p._id === productId)) {
        await fetchProductById(productId);
      }
    }

    setShowDayModal(true);
  };

  const handleAddButtonClick = () => {
    setSelectedDate(null);
    setShowAddModal(true);
  };

  const getPhotoUrl = (photo) =>
    photo
      ? photo.startsWith("http")
        ? photo
        : BACKEND + (photo.startsWith("/") ? photo : `/${photo}`)
      : "https://placehold.co/150x150";

  const styles = `
    @media (max-width: 768px) {
      .fc {
        font-size: 0.85rem;
      }
      .fc-toolbar-chunk {
        flex-direction: column;
        gap: 0.5rem;
      }
      .fc-button {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }
      .modal-dialog {
        max-width: 90%;
      }
      .modal-content .card-img-top {
        height: 100px;
        object-fit: cover;
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
      .modal-body .row .col-md-4 {
        flex: 0 0 100%;
        max-width: 100%;
      }
    }
    @media (max-width: 576px) {
      .fc {
        font-size: 0.75rem;
      }
      .card-header .d-flex {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .modal-body .row .col-md-4 .card {
        margin-bottom: 1rem;
      }
      .action-buttons .btn {
        width: 100%;
      }
    }
  `;

  return (
    <div className="container-fluid p-4">
      <style>{styles}</style>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex flex-column align-items-start gap-2">
            <h5>Dish of the Day</h5>
            <Button
              style={{ backgroundColor: "#28A745", borderColor: "#28A745" }}
              onClick={handleAddButtonClick}
            >
              <Plus /> Add Dish
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={getCalendarEvents()}
              eventClick={handleEventClick}
              select={handleSelect}
              selectable={true}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek,dayGridDay",
              }}
              eventContent={(eventInfo) => (
                <div
                  style={{
                    backgroundColor: "#e0f7fa",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  {eventInfo.event.title}
                </div>
              )}
            />
          )}
        </Card.Body>
      </Card>

      <Modal show={showDayModal} onHide={() => setShowDayModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Dishes for {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDate && getDishesForDate(selectedDate).length > 0 ? (
            <Row>
              {getDishesForDate(selectedDate).map((dish) => {
                const product = products.find(
                  (p) =>
                    p._id ===
                    (typeof dish.productFK === "string"
                      ? dish.productFK
                      : dish.productFK?._id)
                );
                return (
                  <Col key={dish._id} md={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                      <Card.Img
                        variant="top"
                        src={
                          product?.photo
                            ? getPhotoUrl(product.photo)
                            : "https://placehold.co/150x150"
                        }
                        alt={product?.name || "Product Photo"}
                        style={{ height: "150px", objectFit: "cover" }}
                        onError={(e) =>
                          (e.target.src = "https://placehold.co/150x150")
                        }
                      />
                      <Card.Body>
                        <Card.Title className="text-center">
                          {product?.name || "N/A"}
                        </Card.Title>
                        <div className="d-flex justify-content-center gap-2 mt-3 action-buttons">
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowViewModal(true);
                            }}
                          >
                            <Eye /> View
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => {
                              setSelectedDish(dish);
                              setUpdateDishDate(selectedDate);
                              setShowUpdateModal(true);
                            }}
                          >
                            <Pencil /> Update
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteDish(dish._id)}
                          >
                            <Trash /> Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Alert variant="info">No dishes for this day.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDayModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
      >
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>Update Dish Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Date</Form.Label>
              <Form.Control
                type="date"
                value={updateDishDate}
                onChange={(e) => setUpdateDishDate(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUpdateModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateDish}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDate
              ? `Dishes for ${selectedDate} (Add New Dish)`
              : "Add Dish"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDate && (
            <>
              <h6>Existing Dishes:</h6>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDate &&
                    getDishesForDate(selectedDate).map((dish) => (
                      <tr key={dish._id}>
                        <td>{dish.productFK?.name || "N/A"}</td>
                        <td>{dish.statut}</td>
                      </tr>
                    ))}
                  {selectedDate &&
                    getDishesForDate(selectedDate).length === 0 && (
                      <tr>
                        <td colSpan="2">No dishes for this day.</td>
                      </tr>
                    )}
                </tbody>
              </Table>
            </>
          )}
          <h6 className="mt-4">{selectedDate ? "Add New Dish:" : ""}</h6>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate || newDish.date}
                onChange={(e) =>
                  setNewDish({ ...newDish, date: e.target.value })
                }
                required
                disabled={!!selectedDate}
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
              <Form.Check
                type="switch"
                label="Add Random Dishes"
                checked={isRandomAdd}
                onChange={(e) => setIsRandomAdd(e.target.checked)}
              />
            </Form.Group>
            {isRandomAdd ? (
              <Form.Group className="mb-3">
                <Form.Label>Number of Dishes</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={randomDishCount}
                  onChange={(e) => setRandomDishCount(e.target.value)}
                  required
                />
              </Form.Group>
            ) : (
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
            )}
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

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="md"
      >
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedProduct ? (
            <Card className="shadow-sm border-0">
              {selectedProduct.photo ? (
                <Card.Img
                  variant="top"
                  src={getPhotoUrl(selectedProduct.photo)}
                  alt={selectedProduct.name || "Product Photo"}
                  style={{
                    height: "250px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem",
                  }}
                  onError={(e) =>
                    (e.target.src = "https://placehold.co/250x250")
                  }
                />
              ) : (
                <Card.Img
                  variant="top"
                  src="https://placehold.co/250x250"
                  alt="No photo available"
                  style={{
                    height: "250px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem",
                  }}
                />
              )}
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  {selectedProduct.name || "N/A"}
                </Card.Title>
                <Row className="mb-3">
                  <Col xs={4} className="fw-bold">
                    Price:
                  </Col>
                  <Col xs={8}>
                    <Badge bg="success" className="fs-6">
                      ${selectedProduct.price?.toFixed(2) ?? "N/A"}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-bold">
                    Description:
                  </Col>
                  <Col xs={8}>{selectedProduct.description || "N/A"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-bold">
                    Promotion:
                  </Col>
                  <Col xs={8}>
                    {selectedProduct.promotion ? (
                      <Badge bg="warning" text="dark">
                        {selectedProduct.promotion}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-bold">
                    Availability:
                  </Col>
                  <Col xs={8}>
                    <Badge
                      bg={selectedProduct.disponibility ? "success" : "danger"}
                    >
                      {selectedProduct.disponibility ? "Yes" : "No"}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-bold">
                    Duration:
                  </Col>
                  <Col xs={8}>{selectedProduct.duration || "N/A"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-bold">
                    Category:
                  </Col>
                  <Col xs={8}>
                    {selectedProduct.categoryFK?.libelle || "No category"}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-bold">
                    Type of Dish:
                  </Col>
                  <Col xs={8}>{selectedProduct.typePlat || "N/A"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-bold">
                    Archived:
                  </Col>
                  <Col xs={8}>
                    <Badge
                      bg={selectedProduct.archived ? "secondary" : "primary"}
                    >
                      {selectedProduct.archived ? "Yes" : "No"}
                    </Badge>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="warning">No product data available.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DishOfTheDay;