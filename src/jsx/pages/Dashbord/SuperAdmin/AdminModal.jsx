import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";
import useAdminStore from "../../../store/AdminStore";
import useRestaurantStore from "../../../store/RestaurantStore";

export default function AdminModal({ modalState, setModalState, type = "admin" }) {
  const { addAdmin, updateAdmin } = useAdminStore();
  const { addRestaurant, updateRestaurant } = useRestaurantStore();

  const [formData, setFormData] = React.useState(
    type === "restaurant"
      ? { name: "", address: "", phone: "" } // Champs pour restaurant
      : { email: "", password: "", isEmailVerified: false, blocked: false, archived: false }
  );

  useEffect(() => {
    if (modalState.isEditMode && modalState[type === "restaurant" ? "selectedRestaurant" : "selectedAdmin"]) {
      const selected = modalState[type === "restaurant" ? "selectedRestaurant" : "selectedAdmin"];
      setFormData(
        type === "restaurant"
          ? { name: selected.name || "", address: selected.address || "", phone: selected.phone || "" }
          : {
              email: selected.email || "",
              password: "",
              isEmailVerified: selected.isEmailVerified || false,
              blocked: selected.blocked || false,
              archived: selected.archived || false,
            }
      );
    } else {
      setFormData(
        type === "restaurant"
          ? { name: "", address: "", phone: "" }
          : { email: "", password: "", isEmailVerified: false, blocked: false, archived: false }
      );
    }
  }, [modalState.isEditMode, modalState.selectedAdmin, modalState.selectedRestaurant, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "blocked" || name === "isEmailVerified" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = modalState.isEditMode
      ? type === "restaurant"
        ? await updateRestaurant(modalState.selectedRestaurant._id, formData)
        : await updateAdmin(modalState.selectedAdmin._id, formData)
      : type === "restaurant"
      ? await addRestaurant(formData)
      : await addAdmin(formData);

    if (success) {
      swal("Success", modalState.isEditMode ? `${type} updated` : `${type} added`, "success");
      setModalState((prev) => ({ ...prev, show: false }));
    } else {
      swal("Error", modalState.isEditMode ? `Failed to update ${type}` : `Failed to add ${type}`, "error");
    }
  };

  return (
    <Modal show={modalState.show} onHide={() => setModalState((prev) => ({ ...prev, show: false }))}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalState.isEditMode
            ? `Edit ${type === "restaurant" ? "Restaurant" : "Super Admin"}`
            : modalState.viewMode
            ? `${type === "restaurant" ? "Restaurant" : "Super Admin"} Details`
            : `Add ${type === "restaurant" ? "Restaurant" : "Super Admin"}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalState.viewMode ? (
          modalState[type === "restaurant" ? "selectedRestaurant" : "selectedAdmin"] && (
            <div>
              {type === "restaurant" ? (
                <>
                  <p><strong>Name:</strong> {modalState.selectedRestaurant.name}</p>
                  <p><strong>Address:</strong> {modalState.selectedRestaurant.address}</p>
                  <p><strong>Phone:</strong> {modalState.selectedRestaurant.phone}</p>
                </>
              ) : (
                <>
                  <p><strong>Email:</strong> {modalState.selectedAdmin.email}</p>
                  <p><strong>Verified:</strong> {modalState.selectedAdmin.isEmailVerified ? "Yes" : "No"}</p>
                  <p><strong>Blocked:</strong> {modalState.selectedAdmin.blocked ? "Yes" : "No"}</p>
                </>
              )}
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit}>
            {type === "restaurant" ? (
              <>
                <div className="form-group mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!modalState.isEditMode}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Verified</label>
                  <select className="form-control" name="isEmailVerified" value={formData.isEmailVerified} onChange={handleChange}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label>Blocked</label>
                  <select className="form-control" name="blocked" value={formData.blocked} onChange={handleChange}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </>
            )}
            <Button variant="primary" type="submit">
              {modalState.isEditMode ? "Update" : "Add"}
            </Button>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}