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
} from "react-bootstrap";
import {
  Plus,
  Pencil,
  Trash,
  ArrowUp,
  ArrowDown,
  Eye,
  MicFill,
} from "react-bootstrap-icons";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const Ingredient = () => {
  const [ingredients, setIngredients] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [listening, setListening] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "libelle",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newIngredient, setNewIngredient] = useState({
    libelle: "",
    quantity: 0,
    type: "",
    price: 0,
    disponibility: true,
    qtMax: 0,
    photo: null,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoEditFile, setPhotoEditFile] = useState(null);

  const loadIngredients = async () => {
    try {
      const response = await fetch(`${BACKEND}/ingredient`);
      if (!response.ok) throw new Error("Failed to fetch ingredients");
      const ingredientData = await response.json();
      setIngredients(ingredientData);
      setLoading(false);
    } catch {
      setError("Failed to fetch ingredients");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
    // eslint-disable-next-line
  }, []);

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("libelle", newIngredient.libelle);
      formData.append("quantity", newIngredient.quantity);
      formData.append("type", newIngredient.type);
      formData.append("price", newIngredient.price);
      formData.append("disponibility", newIngredient.disponibility);
      formData.append("qtMax", newIngredient.qtMax);
      if (photoFile) formData.append("photo", photoFile);

      const res = await fetch(`${BACKEND}/ingredient`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add ingredient");

      await loadIngredients();
      setShowAddModal(false);
      setNewIngredient({
        libelle: "",
        quantity: 0,
        type: "",
        price: 0,
        disponibility: true,
        qtMax: 0,
        photo: null,
      });
      setPhotoFile(null);
    } catch (err) {
      alert("Error adding ingredient: " + err.message);
    }
  };

  const handleUpdateIngredient = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("libelle", selectedIngredient.libelle);
      formData.append("quantity", selectedIngredient.quantity);
      formData.append("type", selectedIngredient.type);
      formData.append("price", selectedIngredient.price);
      formData.append("disponibility", selectedIngredient.disponibility);
      formData.append("qtMax", selectedIngredient.qtMax);
      if (photoEditFile) formData.append("photo", photoEditFile);

      const res = await fetch(
        `${BACKEND}/ingredient/${selectedIngredient._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to update ingredient");

      await loadIngredients();
      setShowEditModal(false);
      setSelectedIngredient(null);
      setPhotoEditFile(null);
    } catch (err) {
      alert("Error updating ingredient: " + err.message);
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?"))
      return;
    try {
      const res = await fetch(`${BACKEND}/ingredient/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete ingredient");
      await loadIngredients();
      const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
      if (currentPage > totalPages) setCurrentPage(totalPages || 1);
    } catch (err) {
      alert("Error deleting ingredient: " + err.message);
    }
  };

  const handleArchiveIngredient = async (id) => {
    if (!window.confirm("Voulez-vous archiver cet ingrédient ?")) return;
    try {
      const res = await fetch(`${BACKEND}/ingredient/${id}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur d'archivage");
      await loadIngredients();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleRestoreIngredient = async (id) => {
    if (!window.confirm("Voulez-vous restaurer cet ingrédient ?")) return;
    try {
      const res = await fetch(`${BACKEND}/ingredient/${id}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur de restauration");
      await loadIngredients();
    } catch (err) {
      alert("Erreur : " + err.message);
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
    photo
      ? BACKEND + (photo.startsWith("/") ? photo : `/${photo}`)
      : "https://via.placeholder.com/60";

  const filteredIngredients = ingredients
    .filter((i) => {
      const matchSearch = i.libelle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchArchived = showArchived ? i.archived : !i.archived;
      return matchSearch && matchArchived;
    })
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (
        sortConfig.key === "quantity" ||
        sortConfig.key === "price" ||
        sortConfig.key === "qtMax"
      ) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
      if (sortConfig.key === "disponibility" || sortConfig.key === "archived") {
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

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentIngredients = filteredIngredients.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

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

  return (
    <div className="container-fluid p-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column align-items-start">
            <h5>Ingredient List</h5>
            <Button
              style={{ backgroundColor: "#28A745", borderColor: "#28A745" }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus /> Add Ingredient
            </Button>
            <div className="mt-2">
              <Button
                variant={!showArchived ? "primary" : "outline-secondary"}
                className="me-2"
                onClick={() => {
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Actives
              </Button>
              <Button
                variant={showArchived ? "primary" : "outline-secondary"}
                onClick={() => {
                  setShowArchived(true);
                  setCurrentPage(1);
                }}
              >
                Archivés
              </Button>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <InputGroup className="me-3" style={{ maxWidth: "300px" }}>
              <FormControl
                placeholder="Search by libelle..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button
                variant={listening ? "danger" : "secondary"}
                onClick={handleVoiceSearch}
                title="Recherche vocale"
              >
                <MicFill />
              </Button>
            </InputGroup>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" className="m-5" />
          ) : error ? (
            <div className="text-danger m-5">Error: {error}</div>
          ) : filteredIngredients.length === 0 ? (
            <p>
              No ingredients match your search. Click &quot;Add Ingredient&quot;
              to create one.
            </p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th
                      onClick={() => handleSort("libelle")}
                      style={{ cursor: "pointer" }}
                    >
                      Libelle {getSortIcon("libelle")}
                    </th>
                    <th
                      onClick={() => handleSort("quantity")}
                      style={{ cursor: "pointer" }}
                    >
                      Quantity {getSortIcon("quantity")}
                    </th>
                    <th
                      onClick={() => handleSort("type")}
                      style={{ cursor: "pointer" }}
                    >
                      Type {getSortIcon("type")}
                    </th>
                    <th
                      onClick={() => handleSort("price")}
                      style={{ cursor: "pointer" }}
                    >
                      Price {getSortIcon("price")}
                    </th>
                    <th
                      onClick={() => handleSort("disponibility")}
                      style={{ cursor: "pointer" }}
                    >
                      Disponibility {getSortIcon("disponibility")}
                    </th>
                    <th
                      onClick={() => handleSort("qtMax")}
                      style={{ cursor: "pointer" }}
                    >
                      Qt Max {getSortIcon("qtMax")}
                    </th>
                    <th
                      onClick={() => handleSort("archived")}
                      style={{ cursor: "pointer" }}
                    >
                      Archived {getSortIcon("archived")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentIngredients.map((i) => (
                    <tr key={i._id}>
                      <td>
                        {i.photo ? (
                          <img
                            src={getPhotoUrl(i.photo)}
                            alt={i.libelle}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/60")
                            }
                          />
                        ) : (
                          <span>No photo</span>
                        )}
                      </td>
                      <td>{i.libelle}</td>
                      <td>{i.quantity}</td>
                      <td>{i.type}</td>
                      <td>{i.price}</td>
                      <td>{i.disponibility ? "Yes" : "No"}</td>
                      <td>{i.qtMax}</td>
                      <td>{i.archived ? "Yes" : "No"}</td>
                      <td>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#007BFF",
                            borderColor: "#007BFF",
                          }}
                          onClick={() => {
                            setSelectedIngredient(i);
                            setShowViewModal(true);
                          }}
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
                          onClick={() => {
                            setSelectedIngredient({ ...i, photo: null });
                            setShowEditModal(true);
                          }}
                        >
                          <Pencil />
                        </Button>
                        {showArchived ? (
                          <Button
                            size="sm"
                            style={{
                              backgroundColor: "#28A745",
                              borderColor: "#28A745",
                            }}
                            className="ms-2"
                            onClick={() => handleRestoreIngredient(i._id)}
                          >
                            🔄 Restaurer
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            style={{
                              backgroundColor: "#6c757d",
                              borderColor: "#6c757d",
                            }}
                            className="ms-2"
                            onClick={() => handleArchiveIngredient(i._id)}
                          >
                            🗄️
                          </Button>
                        )}
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#FF0000",
                            borderColor: "#FF0000",
                          }}
                          className="ms-2"
                          onClick={() => handleDeleteIngredient(i._id)}
                        >
                          <Trash />
                        </Button>
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
          <Modal.Title>View Ingredient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIngredient && (
            <div>
              <p>
                <strong>Photo:</strong>{" "}
                {selectedIngredient.photo ? (
                  <img
                    src={getPhotoUrl(selectedIngredient.photo)}
                    alt={selectedIngredient.libelle || "Ingredient Photo"}
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
                <strong>Libelle:</strong> {selectedIngredient.libelle || "N/A"}
              </p>
              <p>
                <strong>Quantity:</strong>{" "}
                {selectedIngredient.quantity ?? "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {selectedIngredient.type || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> {selectedIngredient.price ?? "N/A"}
              </p>
              <p>
                <strong>Disponibility:</strong>{" "}
                {selectedIngredient.disponibility ? "Yes" : "No"}
              </p>
              <p>
                <strong>Qt Max:</strong> {selectedIngredient.qtMax ?? "N/A"}
              </p>
              <p>
                <strong>Archived:</strong>{" "}
                {selectedIngredient.archived ? "Yes" : "No"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Ingredient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddIngredient}>
            <Form.Group className="mb-3">
              <Form.Label>Libelle</Form.Label>
              <Form.Control
                type="text"
                value={newIngredient.libelle}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    libelle: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => setPhotoFile(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={newIngredient.type}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    type: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newIngredient.price}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Disponibility</Form.Label>
              <Form.Select
                value={newIngredient.disponibility ? "true" : "false"}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    disponibility: e.target.value === "true",
                  })
                }
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Qt Max</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newIngredient.qtMax}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    qtMax: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Ingredient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIngredient && (
            <Form onSubmit={handleUpdateIngredient}>
              <Form.Group className="mb-3">
                <Form.Label>Libelle</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIngredient.libelle}
                  onChange={(e) =>
                    setSelectedIngredient({
                      ...selectedIngredient,
                      libelle: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                {selectedIngredient.photo && (
                  <div className="mb-2">
                    <img
                      src={getPhotoUrl(selectedIngredient.photo)}
                      alt="Current"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => setPhotoEditFile(e.target.files[0])}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={selectedIngredient.quantity}
                  onChange={(e) =>
                    setSelectedIngredient({
                      ...selectedIngredient,
                      quantity: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIngredient.type}
                  onChange={(e) =>
                    setSelectedIngredient({
                      ...selectedIngredient,
                      type: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={selectedIngredient.price}
                  onChange={(e) =>
                    setSelectedIngredient({
                      ...selectedIngredient,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Disponibility</Form.Label>
                <Form.Select
                  value={selectedIngredient.disponibility ? "true" : "false"}
                  onChange={(e) =>
                    setSelectedIngredient({
                      ...selectedIngredient,
                      disponibility: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Qt Max</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={selectedIngredient.qtMax}
                  onChange={(e) =>
                    setSelectedIngredient({
                      ...selectedIngredient,
                      qtMax: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Ingredient;
