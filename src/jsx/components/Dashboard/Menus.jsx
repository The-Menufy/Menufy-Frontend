import { useState, useEffect, useCallback } from "react";
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
  Plus,
  Pencil,
  Trash,
  ArrowUp,
  ArrowDown,
  Eye,
  MicFill,
} from "react-bootstrap-icons";

// Use Vite env variable for backend URL
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
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newMenu, setNewMenu] = useState({
    name: "",
    visibility: "visible",
    rate: "",
    photo: null,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoEditFile, setPhotoEditFile] = useState(null);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/menu`);
      if (!res.ok) throw new Error("Failed to fetch menus");
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      setError("Failed to fetch menus: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();

    // Cleanup for speech recognition
    return () => {
      setListening(false);
    };
  }, [fetchMenus]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("La reconnaissance vocale n'est pas supportée par votre navigateur.");
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
      setError("Erreur de reconnaissance vocale: " + event.error);
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

  const getPhotoUrl = (photo) => {
    if (photo && photo.startsWith("https://res.cloudinary.com")) {
      return photo;
    }
    return "/fallback-image.png";
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      setError("Error adding menu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMenu = (menu) => {
    setSelectedMenu({ ...menu });
    setShowEditModal(true);
  };

  const handleUpdateMenu = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      setError("Error updating menu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/menu/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete menu");
      await fetchMenus();
      const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
      if (currentPage > totalPages) setCurrentPage(totalPages || 1);
    } catch (err) {
      setError("Error deleting menu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveMenu = async (id) => {
    if (!window.confirm("Voulez-vous archiver ce menu ?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/menu/${id}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur d'archivage");
      await fetchMenus();
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreMenu = async (id) => {
    if (!window.confirm("Voulez-vous restaurer ce menu ?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/menu/${id}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur de restauration");
      await fetchMenus();
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

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

    .btn-view {
      background-color: var(--info-color);
      border-color: var(--info-color);
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
        max-width: 150px;
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
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column align-items-start">
            <h5 className="mb-3">Menu List</h5>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Add a new menu</Tooltip>}
            >
              <Button className="btn-custom btn-add" onClick={() => setShowAddModal(true)}>
                <Plus /> Add Menu
              </Button>
            </OverlayTrigger>
            <div className="mt-2">
              <Button
                variant={!showArchived ? "primary" : "outline-secondary"}
                className="me-2 btn-custom"
                onClick={() => {
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Actives
              </Button>
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
            </div>
          </div>
          <div className="d-flex align-items-center">
            <InputGroup className="me-3" style={{ maxWidth: "300px" }}>
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
            <div className="text-center m-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <div className="text-danger text-center m-5">Error: {error}</div>
          ) : filteredMenus.length === 0 ? (
            <p className="text-center">
              No menus match your search. Click "Add Menu" to create one.
            </p>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="hide-on-mobile">Photo</th>
                      <th onClick={() => handleSort("name")}>
                        Name {getSortIcon("name")}
                      </th>
                      <th onClick={() => handleSort("visibility")} className="hide-on-mobile">
                        Visibility {getSortIcon("visibility")}
                      </th>
                      <th onClick={() => handleSort("rate")}>
                        Rate {getSortIcon("rate")}
                      </th>
                      <th onClick={() => handleSort("archived")} className="hide-on-mobile">
                        Archived {getSortIcon("archived")}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((menu) => (
                      <tr key={menu._id}>
                        <td className="hide-on-mobile">
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
                              onError={(e) => {
                                e.target.src = "/fallback-image.png";
                              }}
                            />
                          ) : (
                            <span>No photo</span>
                          )}
                        </td>
                        <td>{menu.name}</td>
                        <td className="hide-on-mobile">{menu.visibility}</td>
                        <td>{menu.rate}</td>
                        <td className="hide-on-mobile">
                          {menu.archived ? "Yes" : "No"}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>View menu details</Tooltip>}
                            >
                              <Button
                                size="sm"
                                className="btn-custom btn-view"
                                onClick={() => {
                                  setSelectedMenu(menu);
                                  setShowViewModal(true);
                                }}
                              >
                                <Eye />
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Edit menu</Tooltip>}
                            >
                              <Button
                                size="sm"
                                className="ms-2 btn-custom btn-edit"
                                onClick={() => handleEditMenu(menu)}
                              >
                                <Pencil />
                              </Button>
                            </OverlayTrigger>
                            {showArchived ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Restore menu</Tooltip>}
                              >
                                <Button
                                  size="sm"
                                  className="ms-2 btn-custom btn-restore"
                                  onClick={() => handleRestoreMenu(menu._id)}
                                  disabled={loading}
                                >
                                  🔄 Restaurer
                                </Button>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Archive menu</Tooltip>}
                              >
                                <Button
                                  size="sm"
                                  className="ms-2 btn-custom btn-archive"
                                  onClick={() => handleArchiveMenu(menu._id)}
                                  disabled={loading}
                                >
                                  🗄️
                                </Button>
                              </OverlayTrigger>
                            )}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Delete menu</Tooltip>}
                            >
                              <Button
                                size="sm"
                                className="ms-2 btn-custom btn-delete"
                                onClick={() => handleDeleteMenu(menu._id)}
                                disabled={loading}
                              >
                                <Trash />
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
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
                className="btn-custom"
                onClick={() => setShowAddModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="btn-custom"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Add"}
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
                    className="modal-img"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "/fallback-image.png";
                    }}
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
          <Button
            variant="secondary"
            className="btn-custom"
            onClick={() => setShowViewModal(false)}
          >
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
                      className="modal-img"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "/fallback-image.png";
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
                  className="btn-custom"
                  onClick={() => setShowEditModal(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="btn-custom"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Update"}
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