import { useState, useMemo, useCallback } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import useAdminStore from "../../store/AdminStore";
import { nanoid } from "nanoid";
import swal from "sweetalert";
import * as XLSX from "xlsx";
import { GlobalFilter } from "../../components/table/FilteringTable/GlobalFilter";
import { Link } from "react-router-dom";

export default function DashAdmin() {
  const { admins, addAdmin, editAdmin, deleteAdmin } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [formData, setFormData] = useState({
    id: nanoid(),
    name: "",
    phone: "",
    email: "",
    status: "En attente",
    blocked: false,
  });

  // États pour les filtres
  const [globalFilter, setGlobalFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [blockedFilter, setBlockedFilter] = useState('');

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const adminList = useMemo(() => admins, [admins]);

  // Exportation en Excel
  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(adminList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admins");
    XLSX.writeFile(workbook, "admins.xlsx");
  }, [adminList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      editAdmin(formData);
      swal("Succès", "Administrateur modifié avec succès", "success");
    } else {
      addAdmin({ ...formData, id: nanoid() });
      swal("Succès", "Administrateur ajouté avec succès", "success");
    }
    setFormData({ id: nanoid(), name: "", phone: "", email: "", status: "En attente", blocked: false });
    setShowModal(false);
    setIsEditMode(false);
  };

  const handleEdit = (admin) => {
    setFormData(admin);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setShowViewModal(true);
  };

  const handleDelete = (id) => {
    swal({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      buttons: ["Annuler", "Confirmer"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteAdmin(id);
        swal("Administrateur supprimé avec succès", {
          icon: "success",
        });
      }
    });
  };


  // Gestion du blocage / déblocage
  const toggleBlock = (admin) => {
    editAdmin({ ...admin, blocked: !admin.blocked });
  };

  // Filtrage Global et par champs
  const filteredAdmins = useMemo(() => {
    const globallyFiltered = adminList.filter(admin => 
      admin.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      admin.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
      admin.phone.includes(globalFilter)
    );

    return globallyFiltered.filter(admin => 
      admin.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      admin.phone.includes(phoneFilter) &&
      admin.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
      admin.status.toLowerCase().includes(statusFilter.toLowerCase()) &&
      (blockedFilter === '' || (admin.blocked ? 'oui' : 'non').includes(blockedFilter.toLowerCase()))
    );
  }, [adminList, globalFilter, nameFilter, phoneFilter, emailFilter, statusFilter, blockedFilter]);

  // Pagination
  const paginatedAdmins = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredAdmins.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredAdmins, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAdmins.length / rowsPerPage);

  // Gestion des pages
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <>
      <div className="col-12">
      <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditMode ? "Modifier" : "Ajouter"} un Administrateur
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="text-black font-w500">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="text-black font-w500">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mobile"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="text-black font-w500">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
              <label className="text-black font-w500">Status</label>
<select
  className="form-control"
  name="status"
  value={formData.status}
  onChange={handleChange}
  required
>
  <option value="Verified">Verified</option>
  <option value="Pending">Pending</option>
  <option value="Unverified">Unverified</option>
</select>

</div>

              <Button variant="primary" type="submit">
                {isEditMode ? "Modifier" : "Ajouter"}
              </Button>
            </form>
          </Modal.Body>
        </Modal>

        {/* ✅ Modal pour View */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Détails de l'Administrateur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAdmin && (
              <div>
                <p><strong>Nom :</strong> {selectedAdmin.name}</p>
                <p><strong>Mobile :</strong> {selectedAdmin.phone}</p>
                <p><strong>Email :</strong> {selectedAdmin.email}</p>
                <p><strong>Status :</strong> {selectedAdmin.status}</p>
                <p><strong>Bloqué :</strong> {selectedAdmin.blocked ? "Oui" : "Non"}</p>
              </div>
            )}
          </Modal.Body>
        </Modal>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Admin Dashboard</h4>
            <Button variant="success" onClick={() => setShowModal(true)}>
              Ajouter un Admin
            </Button>
            <Button variant="info" className="ms-2" onClick={exportToExcel}>
              <i className="fa fa-file-excel fa-sm me-2"></i>
              Export To Excel
            </Button>
          </div>

          <div className="card-body">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

            <Table className="display w-100">
              <thead>
                <tr>
                  <th>
                    Nom
                    <input type="text" className="form-control mt-1" placeholder="Chercher Nom" value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
                  </th>
                  <th>
                    Téléphone
                    <input type="text" className="form-control mt-1" placeholder="Chercher Téléphone" value={phoneFilter} onChange={e => setPhoneFilter(e.target.value)} />
                  </th>
                  <th>
                    Email
                    <input type="text" className="form-control mt-1" placeholder="Chercher Email" value={emailFilter} onChange={e => setEmailFilter(e.target.value)} />
                  </th>
                  <th>Status
                  <input 
        type="text" 
        className="form-control" 
        placeholder="Chercher Status" 
        value={statusFilter} 
        onChange={e => setStatusFilter(e.target.value)} 
      />


                  </th>
                  <th>Bloqué

                  <input 
        type="text" 
        className="form-control" 
        placeholder="Bloqué (Oui/Non)" 
        value={blockedFilter} 
        onChange={e => setBlockedFilter(e.target.value)} 
      />

                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.name}</td>
                    <td>{admin.phone}</td>
                    <td>{admin.email}</td>
                    <td>{admin.status}</td>
                    <td>{admin.blocked ? "Oui" : "Non"}</td>
                    <td>
                    <div className="d-flex">
          <Button className="btn btn-google shadow btn-xs sharp me-2" onClick={() => handleView(admin)}>
            <i className="fa fa-eye"></i>
          </Button>
          <Button className="btn btn-reddit shadow btn-xs sharp me-2" onClick={() => handleEdit(admin)}>
            <i className="fa fa-pencil"></i>
          </Button>
          <Button className="btn btn-dark shadow btn-xs sharp me-2" onClick={() => toggleBlock(admin)}>
            <i className={`fa ${admin.blocked ? "fa-unlock" : "fa-lock"}`}></i>
          </Button>
          <Button className="btn btn-youtube shadow btn-xs sharp" onClick={() => handleDelete(admin.id)}>
            <i className="fa fa-trash"></i>
          </Button>
        </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button onClick={prevPage} disabled={currentPage === 1}>Précédent</Button>
              <span>Page {currentPage} sur {totalPages}</span>
              <Button onClick={nextPage} disabled={currentPage === totalPages}>Suivant</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
