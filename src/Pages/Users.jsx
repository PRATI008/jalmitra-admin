import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { IoClose } from "react-icons/io5";
import {
  FaSearch,
  FaUsers,
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaUserSlash,
  FaTrash,
  FaPlus,
  FaMapMarkerAlt
} from "react-icons/fa";
import "../Pages/CSS/Users.css";
import adminApi from "../services/api";

const Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);

  // New user form state
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      alert("Name and mobile number are required");
      return;
    }

    setCreating(true);
    try {
      const newUser = await adminApi.createUser({
        name,
        mobile,
        email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jalmitra.com`,
        location: location || "Lucknow",
        address: address || "Sector B, Aliganj, Lucknow"
      });

      setUsers(prev => [newUser, ...prev]);
      alert("User created successfully!");
      setModalShow(false);
      setName("");
      setMobile("");
      setEmail("");
      setLocation("");
      setAddress("");
    } catch (err) {
      alert(err.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    try {
      await adminApi.updateUserStatus(id, newStatus);
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await adminApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.name || ''} ${user.email || ''} ${user.mobile || ''} ${user.location || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeUsers = users.filter(u => (u.status || "Active") === "Active").length;
  const blockedUsers = users.filter(u => u.status === "Blocked").length;

  return (
    <DashboardLayout>
      <div className="users-page">
        {/* Top Header */}
        <div className="users-page-heading">
          <div>
            <h2>Customer Management</h2>
            <p>Monitor, create, and manage all registered JalMitra water customers.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="add-user-modal-btn"
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
                fontSize: '13px'
              }}
            >
              <FaPlus /> Add New Customer
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="users-stats">
          <div className="users-stat-card">
            <div className="users-stat-icon total-users-icon">
              <FaUsers />
            </div>
            <div>
              <p>Total Customers</p>
              <h3>{users.length}</h3>
            </div>
          </div>

          <div className="users-stat-card">
            <div className="users-stat-icon active-users-icon">
              <FaUserCircle />
            </div>
            <div>
              <p>Active Customers</p>
              <h3>{activeUsers}</h3>
            </div>
          </div>

          <div className="users-stat-card">
            <div className="users-stat-icon blocked-users-icon">
              <FaUserSlash />
            </div>
            <div>
              <p>Blocked Customers</p>
              <h3>{blockedUsers}</h3>
            </div>
          </div>
        </div>

        {/* Table Panel */}
        <div className="users-table-panel">
          <div className="users-table-toolbar">
            <div>
              <h3>All Customers</h3>
              <p>Search and manage registered water consumers</p>
            </div>

            <div className="users-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search name, phone, email, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="users-table-scroll">
            <Table className="users-table" responsive hover>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact Details</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="users-name-cell">
                          <div className="users-avatar">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                            <span>ID: #{user.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="users-contact-cell">
                          <span><FaPhoneAlt /> {user.mobile}</span>
                          <span><FaEnvelope /> {user.email || 'N/A'}</span>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '13px', color: '#526e85' }}>
                          <FaMapMarkerAlt style={{ color: '#0a8fda', marginRight: '4px' }} />
                          {user.location || user.address || 'Lucknow'}
                        </span>
                      </td>

                      <td>{user.joined || 'Recently'}</td>

                      <td>
                        <span
                          className={`users-status ${
                            (user.status || "Active") === "Active"
                              ? "status-active"
                              : "status-blocked"
                          }`}
                        >
                          <span className="users-status-dot"></span>
                          {user.status || "Active"}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className={`users-action-btn ${
                              (user.status || "Active") === "Active"
                                ? "block-user-btn"
                                : "unblock-user-btn"
                            }`}
                            onClick={() => toggleStatus(user.id, user.status || "Active")}
                          >
                            {(user.status || "Active") === "Active" ? "Block" : "Unblock"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            style={{
                              background: '#ffebeb',
                              color: '#dc3545',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                            title="Delete user"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="users-empty">
                      {loading ? "Loading customers..." : "No customers found matching search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="users-table-footer">
            Showing {filteredUsers.length} of {users.length} registered customers
          </div>
        </div>

        {/* Modal: Create Customer */}
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          centered
          backdrop="static"
        >
          <Modal.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0" style={{ fontWeight: '700', color: '#12314d' }}>
              Add New Customer
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
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  City / Area
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Aliganj, Lucknow"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Full Delivery Address
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="House No, Street, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
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
                  {creating ? "Adding..." : "Save Customer"}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Users;
