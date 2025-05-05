import React, { useEffect, useState, useMemo } from "react";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import useAdminStore from "../../../store/AdminStore";
import AdminModal from "./AdminModal";
import ArchivedAdminTable from "./ArchivedAdminTable";
import PaginationControls from "./PaginationControls";
import { GlobalFilter } from "../../../components/table/FilteringTable/GlobalFilter";

export default function ArchivedSup() {
  const { admins, fetchAdminsArchived } = useAdminStore();

  const [modalState, setModalState] = useState({
    show: false,
    isEditMode: false,
    selectedAdmin: null,
  });

  const [tableState, setTableState] = useState({
    globalFilter: "",
    currentPage: 1,
    sortOrder: "asc",
  });

  useEffect(() => {
    fetchAdminsArchived();
  }, []);

  useEffect(() => {
    console.log("Admins récupérés :", admins); // 🔍 Debugging pour voir les admins archivés
  }, [admins]);

  const filteredAdmins = useMemo(() => {
    return admins.filter(
      (admin) =>
        admin.archived &&
        admin.email?.toLowerCase().includes(tableState.globalFilter.toLowerCase())
    );
  }, [admins, tableState.globalFilter]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAdmins);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ArchivedSuperAdmins");
    XLSX.writeFile(workbook, "archived_superadmins.xlsx");
  };

  const openModal = (admin = null, isEdit = false) => {
    setModalState({ show: true, isEditMode: isEdit, selectedAdmin: admin });
  };

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h4 className="card-title">Archived Super Admins</h4>
          <Button variant="info" onClick={exportToExcel}>
            <i className="fa fa-file-excel fa-sm me-2" /> Export
          </Button>
        </div>

        <div className="card-body">
          <GlobalFilter
            filter={tableState.globalFilter}
            setFilter={(val) => setTableState((prev) => ({ ...prev, globalFilter: val }))}
          />

          {filteredAdmins.length === 0 ? (
            <p>Aucun admin archivé trouvé.</p>
          ) : (
            <>
              <ArchivedAdminTable
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
            </>
          )}
        </div>
      </div>

      <AdminModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
}
