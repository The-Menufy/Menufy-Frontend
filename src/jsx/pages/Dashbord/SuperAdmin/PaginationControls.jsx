import React, { useMemo } from "react";
import { Button } from "react-bootstrap";

export default function PaginationControls({ tableState, setTableState, admins }) {
  const rowsPerPage = 5;
  const totalPages = useMemo(() => Math.ceil(admins.length / rowsPerPage), [admins]);

  return (
    <div className="d-flex justify-content-between mt-3">
      <Button
        onClick={() => setTableState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
        disabled={tableState.currentPage === 1}
      >
        Prev
      </Button>
      <span>Page {tableState.currentPage} of {totalPages}</span>
      <Button
        onClick={() => setTableState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
        disabled={tableState.currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}