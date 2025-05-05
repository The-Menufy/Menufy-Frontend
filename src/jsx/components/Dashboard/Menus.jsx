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

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [listening, setListening] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Match Category.jsx

  const [newMenu, setNewMenu] = useState({
    name: "",
    visibility: "visible",
    rate: "",
    photo: null,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoEditFile, setPhotoEditFile] = useState(null);

  useEffect(() => {
    fetchMenus();
    // eslint-disable-next-line
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch(`${BACKEND}/menu`);
      if (!res.ok) throw new Error("Failed to fetch menus");
      const data = await res.json();
      setMenus(data);
      setLoading(false);
    } catch {
      setError("Failed to fetch menus");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
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

  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newMenu.name);
      formData.append("visibility", newMenu.visibility);
      formData.append("rate", newMenu.rate);
      if (photoFile) formData.append("photo", photoFile);

      const res = await fetch(`${BACKEND}/menu`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add menu");

      await fetchMenus();
      setShowAddModal(false);
      setNewMenu({ name: "", visibility: "visible", rate: "", photo: null });
      setPhotoFile(null);
    } catch (err) {
      alert("Error adding menu: " + err.message);
    }
  };

  const handleEditMenu = (menu) => {
    setSelectedMenu({ ...menu });
    setShowEditModal(true);
  };

  const handleUpdateMenu = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", selectedMenu.name);
      formData.append("visibility", selectedMenu.visibility);
      formData.append("rate", selectedMenu.rate);
      if (photoEditFile) formData.append("photo", photoEditFile);

      const res = await fetch(`${BACKEND}/menu/${selectedMenu._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update menu");

      await fetchMenus();
      setShowEditModal(false);
      setSelectedMenu(null);
      setPhotoEditFile(null);
    } catch (err) {
      alert("Error updating menu: " + err.message);
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;
    try {
      const res = await fetch(`${BACKEND}/menu/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete menu");
      await fetchMenus();
      const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
      if (currentPage > totalPages) setCurrentPage(totalPages || 1);
    } catch (err) {
      alert("Error deleting menu: " + err.message);
    }
  };

  const handleArchiveMenu = async (id) => {
    if (!window.confirm("Voulez-vous archiver ce menu ?")) return;
    try {
      const res = await fetch(`${BACKEND}/menu/${id}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur d'archivage");
      await fetchMenus();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleRestoreMenu = async (id) => {
    if (!window.confirm("Voulez-vous restaurer ce menu ?")) return;
    try {
      const res = await fetch(`${BACKEND}/menu/${id}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur de restauration");
      await fetchMenus();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  // Filter and sort menus
  const filteredMenus = menus
    .filter((menu) => {
      const matchSearch = menu.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchArchived = showArchived ? menu.archived : !menu.archived;
      return matchSearch && matchArchived;
    })
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "rate") {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
      if (sortConfig.key === "archived") {
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

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
            <h5>Menu List</h5>
            <Button
              style={{ backgroundColor: "#28A745", borderColor: "#28A745" }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus /> Add Menu
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
                placeholder="Search by name..."
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
          ) : filteredMenus.length === 0 ? (
            <p>
              No menus match your search. Click &quot;Add Menu&quot; to create
              one.
            </p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Name {getSortIcon("name")}
                    </th>
                    <th
                      onClick={() => handleSort("visibility")}
                      style={{ cursor: "pointer" }}
                    >
                      Visibility {getSortIcon("visibility")}
                    </th>
                    <th
                      onClick={() => handleSort("rate")}
                      style={{ cursor: "pointer" }}
                    >
                      Rate {getSortIcon("rate")}
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
                  {currentItems.map((menu) => (
                    <tr key={menu._id}>
                      <td>
                        {menu.photo ? (
                          <img
                            src={getPhotoUrl(menu.photo)}
                            alt={menu.name}
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
                      <td>{menu.name}</td>
                      <td>{menu.visibility}</td>
                      <td>{menu.rate}</td>
                      <td>{menu.archived ? "Yes" : "No"}</td>
                      <td>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#007BFF",
                            borderColor: "#007BFF",
                          }}
                          onClick={() => {
                            setSelectedMenu(menu);
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
                          onClick={() => handleEditMenu(menu)}
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
                            onClick={() => handleRestoreMenu(menu._id)}
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
                            onClick={() => handleArchiveMenu(menu._id)}
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
                          onClick={() => handleDeleteMenu(menu._id)}
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

      {/* Add Menu Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMenu}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newMenu.name}
                onChange={(e) =>
                  setNewMenu({ ...newMenu, name: e.target.value })
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
              <Form.Label>Visibility</Form.Label>
              <Form.Select
                value={newMenu.visibility}
                onChange={(e) =>
                  setNewMenu({ ...newMenu, visibility: e.target.value })
                }
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rate</Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Form.Check
                    inline
                    key={value}
                    type="radio"
                    label={value}
                    name="rate"
                    id={`rate-${value}`}
                    value={value}
                    checked={parseInt(newMenu.rate) === value}
                    onChange={(e) =>
                      setNewMenu({ ...newMenu, rate: parseInt(e.target.value) })
                    }
                  />
                ))}
              </div>
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

      {/* View Menu Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Menu Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMenu && (
            <div>
              <p>
                <strong>Photo:</strong>{" "}
                {selectedMenu.photo ? (
                  <img
                    src={getPhotoUrl(selectedMenu.photo)}
                    alt={selectedMenu.name || "Menu Photo"}
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
                <strong>Name:</strong> {selectedMenu.name || "N/A"}
              </p>
              <p>
                <strong>Visibility:</strong> {selectedMenu.visibility || "N/A"}
              </p>
              <p>
                <strong>Rate:</strong> {selectedMenu.rate || "N/A"}
              </p>
              <p>
                <strong>Archived:</strong>{" "}
                {selectedMenu.archived ? "Yes" : "No"}
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

      {/* Edit Menu Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMenu && (
            <Form onSubmit={handleUpdateMenu}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedMenu.name}
                  onChange={(e) =>
                    setSelectedMenu({ ...selectedMenu, name: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                {selectedMenu.photo && (
                  <div className="mb-2">
                    <img
                      src={getPhotoUrl(selectedMenu.photo)}
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
                <Form.Label>Visibility</Form.Label>
                <Form.Select
                  value={selectedMenu.visibility}
                  onChange={(e) =>
                    setSelectedMenu({
                      ...selectedMenu,
                      visibility: e.target.value,
                    })
                  }
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rate</Form.Label>
                <div>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Form.Check
                      inline
                      key={value}
                      type="radio"
                      label={value}
                      name="edit-rate"
                      id={`edit-rate-${value}`}
                      value={value}
                      checked={parseInt(selectedMenu.rate) === value}
                      onChange={(e) =>
                        setSelectedMenu({
                          ...selectedMenu,
                          rate: parseInt(e.target.value),
                        })
                      }
                    />
                  ))}
                </div>
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MenuList;
