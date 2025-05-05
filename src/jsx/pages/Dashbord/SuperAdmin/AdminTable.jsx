import React, { useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import swal from "sweetalert";
import useAdminStore from "../../../store/AdminStore";
import useRestaurantStore from "../../../store/RestaurantStore";

export default function AdminTable({ admins, tableState, setTableState, openModal, type = "admin" }) {
  const { updateAdmin, deleteAdmin, archiveAdmin, fetchAdminsArchived } = useAdminStore();
  const { updateRestaurant, deleteRestaurant } = useRestaurantStore();
  const rowsPerPage = 5;

  const paginatedItems = useMemo(() => {
    const start = (tableState.currentPage - 1) * rowsPerPage;
    return admins.slice(start, start + rowsPerPage);
  }, [admins, tableState.currentPage]);

  const sortByKey = (key) => {
    const sorted = [...admins].sort((a, b) => {
      const aValue = a[key] ?? ""; // fallback en cas de null/undefined
      const bValue = b[key] ?? "";
      if (typeof aValue === "string" && typeof bValue === "string") {
        return tableState.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return tableState.sortOrder === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });

    type === "restaurant"
      ? useRestaurantStore.setState({ restaurants: sorted })
      : useAdminStore.setState({ admins: sorted });

    setTableState((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const togglePassword = (id) => {
    setTableState((prev) => ({
      ...prev,
      visiblePasswords: { ...prev.visiblePasswords, [id]: !prev.visiblePasswords?.[id] },
    }));
  };

  const handleAction = async (actionFn, id, message) => {
    swal({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      buttons: ["Cancel", "Confirm"],
      dangerMode: true,
    }).then(async (confirm) => {
      if (confirm) {
        const success = await actionFn(id);
        if (success) {
          swal("Success", message, "success");
          await fetchAdminsArchived();
        }
      }
    });
  };

  return (
    <Table className="display w-100">
     <thead>
  <tr>
    {type === "restaurant" ? (
      <>
        <th onClick={() => sortByKey("name")} style={{ cursor: "pointer" }}>
          Name {tableState.sortOrder === "asc" ? "↑" : "↓"}
        </th>
        <th onClick={() => sortByKey("address")} style={{ cursor: "pointer" }}>
          Address {tableState.sortOrder === "asc" ? "↑" : "↓"}
        </th>
        <th onClick={() => sortByKey("phone")} style={{ cursor: "pointer" }}>
          Phone {tableState.sortOrder === "asc" ? "↑" : "↓"}
        </th>
      </>
    ) : (
      <>
        <th onClick={() => sortByKey("email")} style={{ cursor: "pointer" }}>
          Email {tableState.sortOrder === "asc" ? "↑" : "↓"}
        </th>
        <th>
          Password
        </th>
        <th onClick={() => sortByKey("isEmailVerified")} style={{ cursor: "pointer" }}>
          Verified {tableState.sortOrder === "asc" ? "↑" : "↓"}
        </th>
        <th onClick={() => sortByKey("blocked")} style={{ cursor: "pointer" }}>
          Blocked {tableState.sortOrder === "asc" ? "↑" : "↓"}
        </th>
      </>
    )}
    <th>Actions</th>
  </tr>
</thead>

      <tbody>
        {paginatedItems.map((item) => (
          <tr key={item._id}>
            {type === "restaurant" ? (
              <>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>{item.phone}</td>
              </>
            ) : (
              <>
                <td>{item.email}</td>
                <td onClick={() => togglePassword(item._id)} style={{ cursor: "pointer" }}>
                  {tableState.visiblePasswords?.[item._id] ? item.password : "•••••••••"}
                </td>
                <td>{item.isEmailVerified ? "Yes" : "No"}</td>
                <td>{item.blocked ? "Yes" : "No"}</td>
              </>
            )}
            <td>
              <Button className="btn btn-google btn-xs me-1" onClick={() => openModal(item, false, true)}>
                <i className="fa fa-eye" />
              </Button>
              <Button className="btn btn-reddit btn-xs me-1" onClick={() => openModal(item, true)}>
                <i className="fa fa-pencil" />
              </Button>
              <Button
                className="btn btn-danger btn-xs"
                onClick={() =>
                  handleAction(archiveAdmin, item._id, `${type === "restaurant" ? "Restaurant" : "Super Admin"} archived`)
                }
              >
                <i className="fa fa-trash" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
