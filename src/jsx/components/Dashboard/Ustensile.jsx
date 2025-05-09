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

const Ustensile = () => {
  const [ustensiles, setUstensiles] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUstensile, setSelectedUstensile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [listening, setListening] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "libelle",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newUstensile, setNewUstensile] = useState({
    libelle: "",
    quantity: 0,
    disponibility: true,
  });
  const [photoFile, setPhotoFile] = useState(null); // Separate state for file input
  const [photoEditFile, setPhotoEditFile] = useState(null); // Separate state for file input during edit

  const loadUstensiles = async () => {
    try {
      const response = await fetch(`${BACKEND}/ustensile`);
      if (!response.ok) throw new Error("Failed to fetch ustensiles");
      const ustensileData = await response.json();
      setUstensiles(ustensileData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch ustensiles");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUstensiles();
    // eslint-disable-next-line
  }, []);

  const handleAddUstensile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("libelle", newUstensile.libelle);
      formData.append("quantity", newUstensile.quantity);
      formData.append("disponibility", newUstensile.disponibility);
      if (photoFile) formData.append("photo", photoFile);

      const res = await fetch(`${BACKEND}/ustensile`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add ustensile");

      await loadUstensiles();
      setShowAddModal(false);
      setNewUstensile({
        libelle: "",
        quantity: 0,
        disponibility: true,
      });
      setPhotoFile(null);
    } catch (err) {
      alert("Error adding ustensile: " + err.message);
    }
  };

  const handleUpdateUstensile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("libelle", selectedUstensile.libelle);
      formData.append("quantity", selectedUstensile.quantity);
      formData.append("disponibility", selectedUstensile.disponibility);
      if (photoEditFile) formData.append("photo", photoEditFile);

      const res = await fetch(`${BACKEND}/ustensile/${selectedUstensile._id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update ustensile");

      await loadUstensiles();
      setShowEditModal(false);
      setSelectedUstensile(null);
      setPhotoEditFile(null);
    } catch (err) {
      alert("Error updating ustensile: " + err.message);
    }
  };

  const handleDeleteUstensile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ustensile?"))
      return;
    try {
      const res = await fetch(`${BACKEND}/ustensile/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete ustensile");
      await loadUstensiles();
      const totalPages = Math.ceil(filteredUstensiles.length / itemsPerPage);
      if (currentPage > totalPages) setCurrentPage(totalPages || 1);
    } catch (err) {
      alert("Error deleting ustensile: " + err.message);
    }
  };

  const handleArchiveUstensile = async (id) => {
    if (!window.confirm("Voulez-vous archiver cet ustensile ?")) return;
    try {
      const res = await fetch(`${BACKEND}/ustensile/${id}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur d'archivage");
      await loadUstensiles();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleRestoreUstensile = async (id) => {
    if (!window.confirm("Voulez-vous restaurer cet ustensile ?")) return;
    try {
      const res = await fetch(`${BACKEND}/ustensile/${id}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur de restauration");
      await loadUstensiles();
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
    photo || "https://via.placeholder.com/60";

  const filteredUstensiles = ustensiles
    .filter((u) => {
      const matchSearch = u.libelle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchArchived = showArchived ? u.archived : !u.archived;
      return matchSearch && matchArchived;
    })
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "quantity") {
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
  const currentUstensiles = filteredUstensiles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUstensiles.length / itemsPerPage);

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
            <h5>Ustensile List</h5>
            <Button
              style={{ backgroundColor: "#28A745", borderColor: "#28A745" }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus /> Add Ustensile
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
          ) : filteredUstensiles.length === 0 ? (
            <p>
              No ustensiles match your search. Click "Add Ustensile"
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
                      onClick={() => handleSort("disponibility")}
                      style={{ cursor: "pointer" }}
                    >
                      Disponibility {getSortIcon("disponibility")}
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
                  {currentUstensiles.map((u) => (
                    <tr key={u._id}>
                      <td>
                        {u.photo ? (
                          <img
                            src={getPhotoUrl(u.photo)}
                            alt={u.libelle}
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
                      <td>{u.libelle}</td>
                      <td>{u.quantity}</td>
                      <td>{u.disponibility ? "Yes" : "No"}</td>
                      <td>{u.archived ? "Yes" : "No"}</td>
                      <td>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#007BFF",
                            borderColor: "#007BFF",
                          }}
                          onClick={() => {
                            setSelectedUstensile(u);
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
                            setSelectedUstensile(u);
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
                            onClick={() => handleRestoreUstensile(u._id)}
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
                            onClick={() => handleArchiveUstensile(u._id)}
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
                          onClick={() => handleDeleteUstensile(u._id)}
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
          <Modal.Title>View Ustensile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUstensile && (
            <div>
              <p>
                <strong>Photo:</strong>{" "}
                {selectedUstensile.photo ? (
                  <img
                    src={getPhotoUrl(selectedUstensile.photo)}
                    alt={selectedUstensile.libelle || "Ustensile Photo"}
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
                <strong>Libelle:</strong> {selectedUstensile.libelle || "N/A"}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedUstensile.quantity ?? "N/A"}
              </p>
              <p>
                <strong>Disponibility:</strong>{" "}
                {selectedUstensile.disponibility ? "Yes" : "No"}
              </p>
              <p>
                <strong>Archived:</strong>{" "}
                {selectedUstensile.archived ? "Yes" : "No"}
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

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Ustensile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUstensile}>
            <Form.Group className="mb-3">
              <Form.Label>Libelle</Form.Label>
              <Form.Control
                type="text"
                value={newUstensile.libelle}
                onChange={(e) =>
                  setNewUstensile({ ...newUstensile, libelle: e.target.value })
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
              {photoFile && (
                <div className="mt-2">
                  <strong>Selected Image Preview:</strong>
                  <img
                    src={URL.createObjectURL(photoFile)}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                step="1"
                value={newUstensile.quantity}
                onChange={(e) =>
                  setNewUstensile({
                    ...newUstensile,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Disponibility</Form.Label>
              <Form.Select
                value={newUstensile.disponibility ? "true" : "false"}
                onChange={(e) =>
                  setNewUstensile({
                    ...newUstensile,
                    disponibility: e.target.value === "true",
                  })
                }
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setPhotoFile(null);
                }}
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Ustensile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUstensile && (
            <Form onSubmit={handleUpdateUstensile}>
              <Form.Group className="mb-3">
                <Form.Label>Libelle</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUstensile.libelle}
                  onChange={(e) =>
                    setSelectedUstensile({
                      ...selectedUstensile,
                      libelle: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                {selectedUstensile.photo && typeof selectedUstensile.photo === "string" && (
                  <div className="mb-2">
                    <img
                      src={getPhotoUrl(selectedUstensile.photo)}
                      alt="Current"
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
                  onChange={(e) => setPhotoEditFile(e.target.files[0])}
                />
                {photoEditFile && (
                  <div className="mt-2">
                    <strong>New Image Preview:</strong>
                    <img
                      src={URL.createObjectURL(photoEditFile)}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  step="1"
                  value={selectedUstensile.quantity}
                  onChange={(e) =>
                    setSelectedUstensile({
                      ...selectedUstensile,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Disponibility</Form.Label>
                <Form.Select
                  value={selectedUstensile.disponibility ? "true" : "false"}
                  onChange={(e) =>
                    setSelectedUstensile({
                      ...selectedUstensile,
                      disponibility: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setPhotoEditFile(null);
                  }}
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

export default Ustensile;