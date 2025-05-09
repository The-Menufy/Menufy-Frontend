import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  FormControl,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Plus, Pencil, Trash, Eye } from "react-bootstrap-icons";

// Use Vite env variable for backend (strip trailing slash if there)
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("libelle");
  const [sortOrder, setSortOrder] = useState("asc");
  const [menuOptions, setMenuOptions] = useState([]);
  const itemsPerPage = 5;

  const [newCategory, setNewCategory] = useState({
    libelle: "",
    description: "",
    photo: "",
    visibility: "visible",
    menu: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoEditFile, setPhotoEditFile] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/category`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenus = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND}/menu`);
      if (!res.ok) throw new Error("Failed to load menus");
      const data = await res.json();
      setMenuOptions(data);
    } catch (err) {
      setError("Failed to load menus: " + err.message);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchMenus()]);
    };
    loadData();
  }, [fetchCategories, fetchMenus]);

  const handleAddCategory = async () => {
    const formData = new FormData();
    Object.entries(newCategory).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (photoFile) formData.append("photo", photoFile);

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/category/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add category");
      await fetchCategories();
      setShowAddModal(false);
      setNewCategory({
        libelle: "",
        description: "",
        photo: "",
        visibility: "visible",
        menu: "",
      });
      setPhotoFile(null);
    } catch (err) {
      setError("Error adding category: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    const formData = new FormData();
    Object.entries(selectedCategory).forEach(([key, value]) => {
      if (key !== "_id" && key !== "__v" && key !== "menu") {
        formData.append(key, value);
      }
    });
    formData.append(
      "menu",
      selectedCategory.menu?._id || selectedCategory.menu
    );
    if (photoEditFile) formData.append("photo", photoEditFile);

    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND}/category/upload/${selectedCategory._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!res.ok) throw new Error(await res.text());
      await fetchCategories();
      setShowEditModal(false);
      setSelectedCategory(null);
      setPhotoEditFile(null);
    } catch (err) {
      setError("Error updating category: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/category/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      await fetchCategories();
    } catch (err) {
      setError("Error deleting category: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveCategory = async (id) => {
    if (!window.confirm("Voulez-vous archiver cette catégorie ?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/category/${id}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: "archived" }),
      });
      if (!res.ok) throw new Error("Erreur d'archivage");
      await fetchCategories();
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreCategory = async (id) => {
    if (!window.confirm("Voulez-vous restaurer cette catégorie ?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/category/${id}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur de restauration");
      await fetchCategories();
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const openEditModal = (cat) => {
    setSelectedCategory({ ...cat });
    setShowEditModal(true);
  };

  const filteredAndSorted = categories
    .filter((cat) => {
      const matchSearch = cat.libelle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchVisibility = showArchived
        ? cat.visibility === "archived"
        : cat.visibility !== "archived";
      return matchSearch && matchVisibility;
    })
    .sort((a, b) => {
      const valueA = sortField === "menu" ? a.menu?.name || "" : a[sortField];
      const valueB = sortField === "menu" ? b.menu?.name || "" : b[sortField];
      if (sortOrder === "asc") {
        return typeof valueA === "string"
          ? valueA.localeCompare(valueB)
          : valueA - valueB;
      }
      return typeof valueB === "string"
        ? valueB.localeCompare(valueA)
        : valueB - valueA;
    });

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = filteredAndSorted.slice(indexOfFirst, indexOfLast);

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
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  const getPhotoUrl = (photo) => {
    if (photo && photo.startsWith("https://res.cloudinary.com")) {
      return photo;
    }
    return "/fallback-image.png";
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
        max-width: 120px;
      }
      .hide-on-mobile {
        display: none;
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
      .card-header .d-flex:last-child .form-control {
        width: 150px;
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
      .card-header .d-flex:last-child .form-control {
        width: 120px;
      }
    }
  `;

  return (
    <div className="container-fluid p-4">
      <style>{styles}</style>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column align-items-start">
            <h5 className="mb-3">Category List</h5>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Add a new category</Tooltip>}
            >
              <Button className="btn-custom btn-add" onClick={() => setShowAddModal(true)}>
                <Plus /> Add Category
              </Button>
            </OverlayTrigger>
            <div className="mt-2">
              <Button
                variant={!showArchived ? "primary" : "outline-secondary"}
                className="me-2 btn-custom"
                onClick={() => setShowArchived(false)}
              >
                Actives
              </Button>
              <Button
                variant={showArchived ? "primary" : "outline-secondary"}
                className="btn-custom"
                onClick={() => setShowArchived(true)}
              >
                Archivées
              </Button>
            </div>
          </div>
          <div className="d-flex gap-2">
            <FormControl
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: 200 }}
            />
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("libelle")}>
                        Libelle{" "}
                        {sortField === "libelle" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th onClick={() => handleSort("description")}>
                        Description{" "}
                        {sortField === "description" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="hide-on-mobile">Photo</th>
                      <th onClick={() => handleSort("visibility")}>
                        Visibility{" "}
                        {sortField === "visibility" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th onClick={() => handleSort("menu")}>
                        Menu{" "}
                        {sortField === "menu" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.map((cat) => (
                      <tr key={cat._id}>
                        <td>{cat.libelle}</td>
                        <td>{cat.description}</td>
                        <td className="hide-on-mobile">
                          {cat.photo ? (
                            <img
                              src={getPhotoUrl(cat.photo)}
                              alt="Category"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                              onError={(e) => (e.target.src = "/fallback-image.png")}
                            />
                          ) : (
                            <span>No photo</span>
                          )}
                        </td>
                        <td>{cat.visibility}</td>
                        <td>{cat.menu?.name || "No menu"}</td>
                        <td>
                          <div className="action-buttons">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>View category details</Tooltip>}
                            >
                              <Button
                                size="sm"
                                className="btn-custom btn-view"
                                onClick={() => {
                                  setSelectedCategory(cat);
                                  setShowViewModal(true);
                                }}
                              >
                                <Eye />
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Edit category</Tooltip>}
                            >
                              <Button
                                size="sm"
                                className="ms-2 btn-custom btn-edit"
                                onClick={() => openEditModal(cat)}
                              >
                                <Pencil />
                              </Button>
                            </OverlayTrigger>
                            {showArchived ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Restore category</Tooltip>}
                              >
                                <Button
                                  size="sm"
                                  className="ms-2 btn-custom btn-restore"
                                  onClick={() => handleRestoreCategory(cat._id)}
                                >
                                  🔄 Restaurer
                                </Button>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Archive category</Tooltip>}
                              >
                                <Button
                                  size="sm"
                                  className="ms-2 btn-custom btn-archive"
                                  onClick={() => handleArchiveCategory(cat._id)}
                                >
                                  🗄️
                                </Button>
                              </OverlayTrigger>
                            )}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Delete category</Tooltip>}
                            >
                              <Button
                                size="sm"
                                className="ms-2 btn-custom btn-delete"
                                onClick={() => handleDeleteCategory(cat._id)}
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

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Libelle</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.libelle}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, libelle: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
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
                value={newCategory.visibility}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, visibility: e.target.value })
                }
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Menu</Form.Label>
              <Form.Select
                value={newCategory.menu}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, menu: e.target.value })
                }
                required
              >
                <option value="">Select a menu</option>
                {menuOptions.map((menu) => (
                  <option key={menu._id} value={menu._id}>
                    {menu.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn-custom" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="btn-custom" onClick={handleAddCategory} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Category Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCategory && (
            <div>
              <p>
                <strong>Libelle:</strong> {selectedCategory.libelle || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedCategory.description || "N/A"}
              </p>
              <p>
                <strong>Photo:</strong>{" "}
                {selectedCategory.photo ? (
                  <img
                    src={getPhotoUrl(selectedCategory.photo)}
                    alt={selectedCategory.libelle || "Category Photo"}
                    className="modal-img"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.src = "/fallback-image.png")}
                  />
                ) : (
                  "No photo available"
                )}
              </p>
              <p>
                <strong>Visibility:</strong>{" "}
                {selectedCategory.visibility || "N/A"}
              </p>
              <p>
                <strong>Menu:</strong>{" "}
                {selectedCategory.menu?.name || "No menu"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn-custom" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCategory && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Libelle</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCategory.libelle}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      libelle: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCategory.description}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                {selectedCategory.photo && (
                  <div className="mb-2">
                    <img
                      src={getPhotoUrl(selectedCategory.photo)}
                      alt="Current"
                      className="modal-img"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.src = "/fallback-image.png")}
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
                  value={selectedCategory.visibility}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      visibility: e.target.value,
                    })
                  }
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Menu</Form.Label>
                <Form.Select
                  value={selectedCategory.menu?._id || selectedCategory.menu}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      menu: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select a menu</option>
                  {menuOptions.map((menu) => (
                    <option key={menu._id} value={menu._id}>
                      {menu.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn-custom" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="btn-custom" onClick={handleUpdateCategory} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;