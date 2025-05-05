import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import AdminTable from "./AdminTable";
import PaginationControls from "./PaginationControls";
import AdminModal from "./AdminModal";
import useAdminStore from "../../../store/AdminStore";
import { GlobalFilter } from "../../../components/table/FilteringTable/GlobalFilter";

export default function SuperDb() {
  const { admins, fetchAdmins } = useAdminStore();

  const [modalState, setModalState] = useState({
    show: false,
    isEditMode: false,
    selectedAdmin: null,
    viewMode: false,
  });

  const [tableState, setTableState] = useState({
    globalFilter: "",
    currentPage: 1,
    sortOrder: "asc",
  });

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // ✅ Appliquer le filtre ici
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) =>
      (admin.email || "").toLowerCase().includes(tableState.globalFilter.toLowerCase())
    );
  }, [admins, tableState.globalFilter]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAdmins);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SuperAdmins");
    XLSX.writeFile(workbook, "superadmins.xlsx");
  };

  const openModal = (admin = null, isEdit = false, viewMode = false) => {
    setModalState({
      show: true,
      isEditMode: isEdit,
      selectedAdmin: admin,
      viewMode,
    });
  };

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h4 className="card-title">Super Admin Dashboard</h4>
          <div>
            <Button variant="success" onClick={() => openModal()}>
              Add Super Admin
            </Button>
            <Button variant="info" className="ms-2" onClick={exportToExcel}>
              <i className="fa fa-file-excel fa-sm me-2" /> Export
            </Button>
          </div>
        </div>

        <div className="card-body">
          <GlobalFilter
            filter={tableState.globalFilter}
            setFilter={(val) =>
              setTableState((prev) => ({ ...prev, globalFilter: val }))
            }
          />

          <AdminTable
            admins={filteredAdmins}
            tableState={tableState}
            setTableState={setTableState}
            openModal={openModal}
          />

          <PaginationControls
            tableState={tableState}
            setTableState={setTableState}
            admins={filteredAdmins}
          />
        </div>
      </div>

      <AdminModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
}
