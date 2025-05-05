import React, { useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import swal from "sweetalert";
import useAdminStore from "../../../store/AdminStore";

export default function ArchivedAdminTable({ admins, tableState, setTableState, openModal }) {
  const { updateAdmin, deleteAdmin } = useAdminStore();
  const rowsPerPage = 5;

  const paginatedAdmins = useMemo(() => {
    const start = (tableState.currentPage - 1) * rowsPerPage;
    return admins.slice(start, start + rowsPerPage);
  }, [admins, tableState.currentPage]);

  const sortByKey = (key) => {
    const sorted = [...admins].sort((a, b) => {
      const aValue = a[key] ?? "";
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
    useAdminStore.setState({ admins: sorted });
    setTableState((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const togglePassword = (id) => {
    setTableState((prev) => ({
      ...prev,
      visiblePasswords: {
        ...prev.visiblePasswords,
        [id]: !prev.visiblePasswords?.[id],
      },
    }));
  };

  const handleAction = (actionFn, id, message) => {
    swal({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      buttons: ["Cancel", "Confirm"],
      dangerMode: true,
    }).then(async (confirm) => {
      if (confirm && (await actionFn(id))) {
        swal("Success", message, "success");
      }
    });
  };

  return (
    <Table className="display w-100">
      <thead>
        <tr>
          <th onClick={() => sortByKey("email")} style={{ cursor: "pointer" }}>
            Email {tableState.sortOrder === "asc" ? "↑" : "↓"}
          </th>
          <th>Password</th>
          <th onClick={() => sortByKey("isEmailVerified")} style={{ cursor: "pointer" }}>
            Verified {tableState.sortOrder === "asc" ? "↑" : "↓"}
          </th>
          <th onClick={() => sortByKey("blocked")} style={{ cursor: "pointer" }}>
            Blocked {tableState.sortOrder === "asc" ? "↑" : "↓"}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedAdmins.map((admin) => (
          <tr key={admin._id}>
            <td>{admin.email}</td>
            <td onClick={() => togglePassword(admin._id)} style={{ cursor: "pointer" }}>
              {tableState.visiblePasswords?.[admin._id] ? admin.password : "•••••••••"}
            </td>
            <td>{admin.isEmailVerified ? "Yes" : "No"}</td>
            <td>{admin.blocked ? "Yes" : "No"}</td>
            <td>
              <Button className="btn btn-google btn-xs me-1" onClick={() => openModal(admin)}>
                <i className="fa fa-eye" />
              </Button>
              <Button className="btn btn-reddit btn-xs me-1" onClick={() => openModal(admin, true)}>
                <i className="fa fa-pencil" />
              </Button>
              <Button
                className="btn btn-warning btn-xs me-1"
                onClick={() =>
                  handleAction(() => updateAdmin(admin._id, { archived: false }), admin._id, "Super Admin unarchived")
                }
              >
                <i className="fa fa-undo" />
              </Button>
              <Button
                className="btn btn-danger btn-xs"
                onClick={() => handleAction(deleteAdmin, admin._id, "Super Admin deleted")}
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
