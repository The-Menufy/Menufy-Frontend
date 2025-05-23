import { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import {
  Plus,
  Pencil,
  Trash,
  Eye,
  Archive,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const ManageVariants = () => {
  const [variants, setVariants] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [newVariant, setNewVariant] = useState({
    name: "",
    portions: [],
    note: "",
  });
  const [newImageFile, setNewImageFile] = useState(null); // Separate state for file input
  const [editImageFile, setEditImageFile] = useState(null); // Separate state for file input during edit
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Helper for media URL
  const getMediaUrl = (media) => media || "https://via.placeholder.com/100?text=No+Image";

  // Fetch all variants
  const fetchVariants = async () => {
    try {
      const response = await fetch(`${BACKEND}/api/recipe-variants`);
      if (!response.ok)
        throw new Error(`Failed to fetch variants: ${response.statusText}`);
      const data = await response.json();
      // Ensure isArchived is defined, default to false if missing
      const normalizedData = Array.isArray(data)
        ? data.map((variant) => ({
            ...variant,
            isArchived: variant.isArchived ?? false,
          }))
        : [];
      setVariants(normalizedData);
    } catch (error) {
      console.error("Error fetching variants:", error.message);
      setVariants([]);
      alert(`Error fetching variants: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchVariants();
    // eslint-disable-next-line
  }, []);

  // Add new variant
  const handleAddVariant = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newVariant.name);
    formData.append("portions", newVariant.portions.join(","));
    formData.append("note", newVariant.note);
    if (newImageFile) formData.append("photo", newImageFile);

    try {
      const response = await fetch(`${BACKEND}/api/recipe-variants`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add variant: ${response.statusText}`);
      }
      setShowAddModal(false);
      setNewVariant({
        name: "",
        portions: [],
        note: "",
      });
      setNewImageFile(null);
      await fetchVariants();
      alert("Variant added successfully!");
    } catch (error) {
      console.error("Error adding variant:", error.message);
      alert(`Error adding variant: ${error.message}`);
    }
  };

  // Update variant
  const handleUpdateVariant = async (e) => {
    e.preventDefault();
    if (!selectedVariant) return;

    const formData = new FormData();
    formData.append("name", selectedVariant.name);
    formData.append("portions", selectedVariant.portions.join(","));
    formData.append("note", selectedVariant.note);
    if (editImageFile) formData.append("photo", editImageFile);

    try {
      const response = await fetch(
        `${BACKEND}/api/recipe-variants/${selectedVariant._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update variant: ${response.statusText}`);
      }
      setShowEditModal(false);
      setSelectedVariant(null);
      setEditImageFile(null);
      await fetchVariants();
      alert("Variant updated successfully!");
    } catch (error) {
      console.error("Error updating variant:", error.message);
      alert(`Error updating variant: ${error.message}`);
    }
  };

  // Delete variant
  const handleDeleteVariant = async (id) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        const response = await fetch(`${BACKEND}/api/recipe-variants/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to delete variant: ${response.statusText}`);
        }
        await fetchVariants();
        // Recalculate total pages after state update
        const updatedVariants = variants.filter((v) => v._id !== id);
        const filteredUpdatedVariants = updatedVariants.filter((variant) =>
          showArchived ? variant.isArchived : !variant.isArchived
        );
        const totalPages = Math.ceil(filteredUpdatedVariants.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        } else if (totalPages === 0) {
          setCurrentPage(1);
        }
        alert("Variant deleted successfully!");
      } catch (error) {
        console.error("Error deleting variant:", error.message);
        alert(`Error deleting variant: ${error.message}`);
      }
    }
  };

  // Archive variant
  const handleArchiveVariant = async (id) => {
    if (window.confirm("Are you sure you want to archive this variant?")) {
      try {
        const response = await fetch(
          `${BACKEND}/api/recipe-variants/${id}/archive`,
          {
            method: "PUT",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to archive variant: ${response.statusText}`);
        }
        await fetchVariants();
        alert("Variant archived successfully!");
      } catch (error) {
        console.error("Error archiving variant:", error.message);
        alert(`Error archiving variant: ${error.message}`);
      }
    }
  };

  // Restore variant
  const handleRestoreVariant = async (id) => {
    if (window.confirm("Are you sure you want to restore this variant?")) {
      try {
        const response = await fetch(
          `${BACKEND}/api/recipe-variants/${id}/restore`,
          {
            method: "PUT",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to restore variant: ${response.statusText}`);
        }
        await fetchVariants();
        alert("Variant restored successfully!");
      } catch (error) {
        console.error("Error restoring variant:", error.message);
        alert(`Error restoring variant: ${error.message}`);
      }
    }
  };

  // Handle view details
  const handleViewDetails = (variant) => {
    setSelectedVariant(variant);
    setShowDetailsModal(true);
  };

  // Handle edit variant
  const handleEditVariant = (variant) => {
    setSelectedVariant(variant);
    setEditImageFile(null); // Reset file input
    setShowEditModal(true);
  };

  // Filter and paginate variants based on showArchived state
  const filteredVariants = variants.filter((variant) =>
    showArchived ? variant.isArchived : !variant.isArchived
  );

  const totalItems = filteredVariants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentVariants = filteredVariants.slice(indexOfFirst, indexOfLast);

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
      {/* Variants Table */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column align-items-start">
            <h5>
              {showArchived
                ? "Archived Recipe Variants"
                : "Active Recipe Variants"}
            </h5>
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
            <Button
              style={{
                backgroundColor: "#28A745",
                borderColor: "#28A745",
                marginTop: "10px",
              }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus /> Add Variant
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {filteredVariants.length === 0 ? (
            <p>No {showArchived ? "archived" : "active"} variants found.</p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Portions</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVariants.map((variant) => (
                    <tr key={variant._id}>
                      <td>{variant.name}</td>
                      <td>{variant.portions.join(", ")}</td>
                      <td>
                        {variant.images && variant.images.length > 0 ? (
                          <img
                            src={getMediaUrl(variant.images[0])}
                            alt={variant.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/50?text=No+Image";
                            }}
                          />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#007BFF",
                            borderColor: "#007BFF",
                            marginRight: "5px",
                          }}
                          onClick={() => handleViewDetails(variant)}
                        >
                          <Eye />
                        </Button>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#FFD600",
                            borderColor: "#FFD600",
                            marginRight: "5px",
                          }}
                          onClick={() => handleEditVariant(variant)}
                        >
                          <Pencil />
                        </Button>
                        {showArchived ? (
                          <Button
                            size="sm"
                            style={{
                              backgroundColor: "#28A745",
                              borderColor: "#28A745",
                              marginRight: "5px",
                            }}
                            onClick={() => handleRestoreVariant(variant._id)}
                          >
                            <ArrowCounterclockwise />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            style={{
                              backgroundColor: "#6C757D",
                              borderColor: "#6C757D",
                              marginRight: "5px",
                            }}
                            onClick={() => handleArchiveVariant(variant._id)}
                          >
                            <Archive />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#FF0000",
                            borderColor: "#FF0000",
                          }}
                          onClick={() => handleDeleteVariant(variant._id)}
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

      {/* Add Variant Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Variant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddVariant}>
            <Form.Group className="mb-3">
              <Form.Label>Variant Name</Form.Label>
              <Form.Control
                type="text"
                value={newVariant.name}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Portions</Form.Label>
              <div>
                {["half-portion", "medium-portion", "double-portion"].map(
                  (portion, index) => (
                    <Form.Check
                      inline
                      key={index}
                      type="checkbox"
                      label={portion}
                      value={portion}
                      checked={newVariant.portions.includes(portion)}
                      onChange={(e) => {
                        const updatedPortions = e.target.checked
                          ? [...newVariant.portions, portion]
                          : newVariant.portions.filter((p) => p !== portion);
                        setNewVariant({
                          ...newVariant,
                          portions: updatedPortions,
                        });
                      }}
                    />
                  )
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newVariant.note}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, note: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewImageFile(e.target.files[0])}
              />
              {newImageFile && (
                <div className="mt-2">
                  <strong>Selected Image Preview:</strong>
                  <img
                    src={URL.createObjectURL(newImageFile)}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setNewImageFile(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Variant
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Variant Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVariant && (
            <div>
              <p>
                <strong>Name:</strong> {selectedVariant.name}
              </p>
              <p>
                <strong>Portions:</strong>{" "}
                {selectedVariant.portions.join(", ") || "None"}
              </p>
              <p>
                <strong>Note:</strong> {selectedVariant.note || "None"}
              </p>
              <p>
                <strong>Image:</strong>
              </p>
              {selectedVariant.images && selectedVariant.images.length > 0 ? (
                <img
                  src={getMediaUrl(selectedVariant.images[0])}
                  alt={selectedVariant.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/100?text=No+Image";
                  }}
                />
              ) : (
                <span>No image</span>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Variant Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Variant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVariant && (
            <Form onSubmit={handleUpdateVariant}>
              <Form.Group className="mb-3">
                <Form.Label>Variant Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedVariant.name}
                  onChange={(e) =>
                    setSelectedVariant({
                      ...selectedVariant,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Portions</Form.Label>
                <div>
                  {["half-portion", "medium-portion", "double-portion"].map(
                    (portion, index) => (
                      <Form.Check
                        inline
                        key={index}
                        type="checkbox"
                        label={portion}
                        value={portion}
                        checked={selectedVariant.portions.includes(portion)}
                        onChange={(e) => {
                          const updatedPortions = e.target.checked
                            ? [...selectedVariant.portions, portion]
                            : selectedVariant.portions.filter(
                                (p) => p !== portion
                              );
                          setSelectedVariant({
                            ...selectedVariant,
                            portions: updatedPortions,
                          });
                        }}
                      />
                    )
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedVariant.note || ""}
                  onChange={(e) =>
                    setSelectedVariant({
                      ...selectedVariant,
                      note: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Current Image:</Form.Label>
                <div>
                  {selectedVariant.images &&
                  selectedVariant.images.length > 0 &&
                  typeof selectedVariant.images[0] === "string" ? (
                    <img
                      src={getMediaUrl(selectedVariant.images[0])}
                      alt={selectedVariant.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        marginBottom: "10px",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <Form.Label>Upload New Image (optional):</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                />
                {editImageFile && (
                  <div className="mt-2">
                    <strong>New Image Preview:</strong>
                    <img
                      src={URL.createObjectURL(editImageFile)}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </Form.Group>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditImageFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Variant
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageVariants;