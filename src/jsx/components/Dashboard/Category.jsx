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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("libelle");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;
  const [menuOptions, setMenuOptions] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);

  const [newCategory, setNewCategory] = useState({
    libelle: "",
    description: "",
    photo: "",
    visibility: "visible",
    menu: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoEditFile, setPhotoEditFile] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND}/category`);
      const data = await res.json();
      console.log("Fetched categories:", data); // Debug: Log fetched data
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err); // Debug: Log fetch error
      setError("Failed to fetch categories");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetch(`${BACKEND}/menu`)
      .then((res) => res.json())
      .then((data) => setMenuOptions(data))
      .catch(() => console.error("Failed to load menus"));
    // eslint-disable-next-line
  }, []);

  const handleAddCategory = async () => {
    const formData = new FormData();
    Object.entries(newCategory).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (photoFile) formData.append("photo", photoFile);

    try {
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
      alert("Error adding category: " + err.message);
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
    if (photoEditFile) {
      formData.append("photo", photoEditFile);
    }

    try {
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
      alert("Error updating category: " + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      const res = await fetch(`${BACKEND}/category/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      await fetchCategories();
    } catch (err) {
      alert("Error deleting category: " + err.message);
    }
  };

  const handleArchiveCategory = async (id) => {
    if (!window.confirm("Voulez-vous archiver cette catégorie ?")) return;
    try {
      const res = await fetch(`${BACKEND}/category/${id}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: "archived" }),
      });
      if (!res.ok) throw new Error("Erreur d'archivage");
      await fetchCategories();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleRestoreCategory = async (id) => {
    if (!window.confirm("Voulez-vous restaurer cette catégorie ?")) return;
    try {
      const res = await fetch(`${BACKEND}/category/${id}/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur de restauration");
      await fetchCategories();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const openEditModal = (cat) => {
    setSelectedCategory({ ...cat });
    setShowEditModal(true);
  };

  // Filter and sort categories
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

  // Pagination
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

  // Helper to build full photo URL
  const getPhotoUrl = (photo) => {
    if (photo && photo.startsWith("https://res.cloudinary.com")) {
      console.log("Using Cloudinary URL:", photo); // Debug: Log Cloudinary URL
      return photo; // Use the full Cloudinary URL as-is
    }
    console.log("Using fallback URL for photo:", photo); // Debug: Log fallback
    return "/fallback-image.png"; // Local fallback image
  };

  return (
    <div className="container-fluid p-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column align-items-start">
            <h5>Category List</h5>
            <Button
              style={{ backgroundColor: "#28A745", borderColor: "#28A745" }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus /> Add Category
            </Button>

            <div className="mt-2">
              <Button
                variant={!showArchived ? "primary" : "outline-secondary"}
                className="me-2"
                onClick={() => setShowArchived(false)}
              >
                Actives
              </Button>
              <Button
                variant={showArchived ? "primary" : "outline-secondary"}
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
            <Spinner animation="border" />
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort("libelle")}
                      style={{ cursor: "pointer" }}
                    >
                      Libelle{" "}
                      {sortField === "libelle" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      onClick={() => handleSort("description")}
                      style={{ cursor: "pointer" }}
                    >
                      Description{" "}
                      {sortField === "description" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th>Photo</th>
                    <th
                      onClick={() => handleSort("visibility")}
                      style={{ cursor: "pointer" }}
                    >
                      Visibility{" "}
                      {sortField === "visibility" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      onClick={() => handleSort("menu")}
                      style={{ cursor: "pointer" }}
                    >
                      Menu{" "}
                      {sortField === "menu" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map((cat) => (
                    <tr key={cat._id}>
                      <td>{cat.libelle}</td>
                      <td>{cat.description}</td>
                      <td>
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
                            onError={(e) => {
                              console.error("Image load failed:", cat.photo); // Debug: Log error
                              e.target.src = "/fallback-image.png"; // Use local fallback
                            }}
                          />
                        ) : (
                          <span>No photo</span>
                        )}
                      </td>
                      <td>{cat.visibility}</td>
                      <td>{cat.menu?.name || "No menu"}</td>
                      <td>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#007BFF",
                            borderColor: "#007BFF",
                          }}
                          onClick={() => {
                            setSelectedCategory(cat);
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
                          onClick={() => openEditModal(cat)}
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
                            onClick={() => handleRestoreCategory(cat._id)}
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
                            onClick={() => handleArchiveCategory(cat._id)}
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
                          onClick={() => handleDeleteCategory(cat._id)}
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
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Add
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
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      console.error("Image load failed:", selectedCategory.photo); // Debug: Log error
                      e.target.src = "/fallback-image.png"; // Use local fallback
                    }}
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
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
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
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        console.error("Image load failed:", selectedCategory.photo); // Debug: Log error
                        e.target.src = "/fallback-image.png"; // Use local fallback
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
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCategory}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;