import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";

import { GlobalFilter } from "../../../components/table/FilteringTable/GlobalFilter";
import AdminModal from "../SuperAdmin/AdminModal";
import AdminTable from "../SuperAdmin/AdminTable";
import PaginationControls from "../SuperAdmin/PaginationControls";
import useRestaurantStore from "../../../store/RestaurantStore";

export default function RestoDb() {
  const { restaurants, fetchRestaurants } = useRestaurantStore();

  const [modalState, setModalState] = React.useState({
    show: false,
    isEditMode: false,
    selectedRestaurant: null,
    viewMode: false,
  });
  const [tableState, setTableState] = React.useState({
    globalFilter: "",
    currentPage: 1,
    sortOrder: "asc",
  });

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(restaurants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Restaurants");
    XLSX.writeFile(workbook, "restaurants.xlsx");
  };

  const openModal = (restaurant = null, isEdit = false, viewMode = false) => {
    console.log("Ouverture du modal avec :", { show: true, isEditMode: isEdit, selectedRestaurant: restaurant, viewMode });
    setModalState({ show: true, isEditMode: isEdit, selectedRestaurant: restaurant, viewMode });
  };

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h4 className="card-title">Restaurant Dashboard</h4>
          <div>
            <Button variant="success" onClick={() => openModal()}>
              Add Restaurant
            </Button>
            <Button variant="info" className="ms-2" onClick={exportToExcel}>
              <i className="fa fa-file-excel fa-sm me-2" /> Export
            </Button>
          </div>
        </div>

        <div className="card-body">
          <GlobalFilter
            filter={tableState.globalFilter}
            setFilter={(val) => setTableState((prev) => ({ ...prev, globalFilter: val }))}
          />
          <AdminTable
            admins={restaurants} // On passe "restaurants" comme "admins"
            tableState={tableState}
            setTableState={setTableState}
            openModal={openModal}
            type="restaurant" // Ajout d’un prop pour différencier
          />
          <PaginationControls tableState={tableState} setTableState={setTableState} admins={restaurants} />
        </div>
      </div>

      <AdminModal
        modalState={modalState}
        setModalState={setModalState}
        type="restaurant" // Ajout d’un prop pour différencier
      />
    </div>
  );
}