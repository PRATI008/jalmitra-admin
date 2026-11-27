import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { IoClose } from "react-icons/io5";
import {
  FaSearch,
  FaStore,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaPhoneAlt,
  FaTrash,
  FaPlus,
  FaMapMarkerAlt,
  FaTint
} from "react-icons/fa";
import "../Pages/CSS/Supplier.css";
import adminApi from "../services/api";

const Supplier = () => {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);

  // New supplier form state
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [waterType, setWaterType] = useState("Both");
  const [creating, setCreating] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const data = await adminApi.getSuppliers();
      if (Array.isArray(data)) {
        setSuppliers(data);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Supplier name and contact phone are required");
      return;
    }

    setCreating(true);
    try {
      const newSup = await adminApi.createSupplier({
        name,
        business: business || `${name} Water Supply`,
        phone,
        email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jalmitra.com`,
        location: location || "Lucknow",
        waterType,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      });

      setSuppliers(prev => [newSup, ...prev]);
      alert("Supplier registered successfully!");
      setModalShow(false);
      setName("");
      setBusiness("");
      setPhone("");
      setEmail("");
      setLocation("");
    } catch (err) {
      alert(err.message || "Failed to create supplier");
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminApi.updateSupplierStatus(id, status);
      setSuppliers(prev =>
        prev.map(s => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await adminApi.deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete supplier");
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    `${s.name || ''} ${s.business || ''} ${s.email || ''} ${s.phone || ''} ${s.location || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const approved = suppliers.filter(s => (s.status || "Approved") === "Approved").length;
  const pending = suppliers.filter(s => s.status === "Pending").length;

  return (
    <DashboardLayout>
      <div className="supplier-page">
        {/* Page Heading */}
        <div className="supplier-heading">
          <div>
            <h2>Supplier Management</h2>
            <p>Vetting, approval, status tracking and onboarding of water vendors.</p>
          </div>

          <div>
            <button
              type="button"
              className="supplier-create-btn"
              onClick={() => setModalShow(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: '#0a8fda',
                color: 'white',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '13px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(10, 143, 218, 0.2)'
              }}
            >
              <FaPlus /> Onboard New Supplier
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="supplier-stats">
          <div className="supplier-stat-card">
            <div className="supplier-stat-icon total">
              <FaStore />
            </div>
            <div>
              <p>Total Suppliers</p>
              <h3>{suppliers.length}</h3>
            </div>
          </div>

          <div className="supplier-stat-card">
            <div className="supplier-stat-icon approved">
              <FaCheckCircle />
            </div>
            <div>
              <p>Approved & Active</p>
              <h3>{approved}</h3>
            </div>
          </div>

          <div className="supplier-stat-card">
            <div className="supplier-stat-icon pending">
              <FaClock />
            </div>
            <div>
              <p>Pending Approval</p>
              <h3>{pending}</h3>
            </div>
          </div>
        </div>

        {/* Table Panel */}
        <div className="supplier-table-card">
          <div className="supplier-table-heading">
            <div>
              <h3>All Registered Suppliers</h3>
              <p>Manage verification and approval status</p>
            </div>

            <div className="supplier-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search vendor name, business, area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="supplier-table-wrapper">
            <Table className="supplier-table" responsive hover>
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Business / Service</th>
                  <th>Contact Details</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>
                        <div className="supplier-person">
                          <div className="supplier-avatar">
                            {(supplier.name || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{supplier.name}</strong>
                            <span style={{ fontSize: '11px', color: '#7a94a8', display: 'block' }}>
                              #{supplier.id} • Joined {supplier.date || '2026'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <strong>{supplier.business || supplier.tagline || supplier.name}</strong>
                          <span style={{ fontSize: '11px', color: '#0a8fda', display: 'block' }}>
                            <FaTint /> {supplier.water || 'Chilled & Normal'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="supplier-contact">
                          <span><FaPhoneAlt /> {supplier.phone || supplier.mobile}</span>
                          <span><FaEnvelope /> {supplier.email || 'N/A'}</span>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '13px', color: '#526e85' }}>
                          <FaMapMarkerAlt style={{ color: '#0a8fda', marginRight: '4px' }} />
                          {supplier.location || 'Lucknow'}
                        </span>
                      </td>

                      <td>
                        <span className={`supplier-status ${(supplier.status || 'Approved').toLowerCase()}`}>
                          {supplier.status || 'Approved'}
                        </span>
                      </td>

                      <td>
                        <div className="supplier-actions">
                          {supplier.status !== "Approved" && (
                            <button
                              className="supplier-btn approve"
                              onClick={() => updateStatus(supplier.id, "Approved")}
                              title="Approve supplier"
                            >
                              Approve
                            </button>
                          )}

                          {supplier.status !== "Rejected" && (
                            <button
                              className="supplier-btn reject"
                              onClick={() => updateStatus(supplier.id, "Rejected")}
                              title="Reject supplier"
                            >
                              Reject
                            </button>
                          )}

                          {supplier.status !== "Blocked" ? (
                            <button
                              className="supplier-btn block"
                              onClick={() => updateStatus(supplier.id, "Blocked")}
                              title="Block supplier"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              className="supplier-btn unblock"
                              onClick={() => updateStatus(supplier.id, "Approved")}
                              title="Unblock supplier"
                            >
                              Unblock
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(supplier.id)}
                            style={{
                              background: '#ffebeb',
                              color: '#dc3545',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '7px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                            title="Delete supplier"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="supplier-empty">
                      {loading ? "Loading suppliers..." : "No suppliers found matching your query."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Modal: Onboard New Supplier */}
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          centered
          backdrop="static"
        >
          <Modal.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0" style={{ fontWeight: '700', color: '#12314d' }}>
              Onboard New Water Supplier
            </h4>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setModalShow(false)}
            >
              <IoClose size={20} />
            </button>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={handleCreateSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Supplier / Contact Person Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Mishra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Business / Agency Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mishra RO Water Plant"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                    Water Types
                  </label>
                  <select
                    className="form-control"
                    value={waterType}
                    onChange={(e) => setWaterType(e.target.value)}
                  >
                    <option value="Both">Both (Chilled & Normal)</option>
                    <option value="Normal">Normal RO Water</option>
                    <option value="Cold">Chilled Mineral Water</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="vendor@jalmitra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Location / Operating Area
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Aliganj, Lucknow"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalShow(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#0a8fda', borderColor: '#0a8fda' }}
                  disabled={creating}
                >
                  {creating ? "Saving..." : "Save Supplier"}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Supplier;
