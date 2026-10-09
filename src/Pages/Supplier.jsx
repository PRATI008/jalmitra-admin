import React, { useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import {
  FaSearch,
  FaStore,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import "../Pages/CSS/Supplier.css";

const Supplier = () => {
  const [search, setSearch] = useState("");

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Amit Kumar",
      business: "Aqua Water Supply",
      email: "amit@gmail.com",
      mobile: "9876543210",
      date: "05 Oct 2026",
      status: "Approved",
    },
    {
      id: 2,
      name: "Rohit Singh",
      business: "Fresh Drop Water",
      email: "rohit@gmail.com",
      mobile: "9876543211",
      date: "06 Oct 2026",
      status: "Pending",
    },
    {
      id: 3,
      name: "Priya Verma",
      business: "Pure Water Service",
      email: "priya@gmail.com",
      mobile: "9876543212",
      date: "07 Oct 2026",
      status: "Approved",
    },
    {
      id: 4,
      name: "Ankit Yadav",
      business: "Blue Drop Supply",
      email: "ankit@gmail.com",
      mobile: "9876543213",
      date: "08 Oct 2026",
      status: "Rejected",
    },
  ]);

  const updateStatus = (id, status) => {
    setSuppliers((previous) =>
      previous.map((supplier) =>
        supplier.id === id ? { ...supplier, status } : supplier
      )
    );
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.name} ${supplier.business} ${supplier.email} ${supplier.mobile}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const approved = suppliers.filter(
    (supplier) => supplier.status === "Approved"
  ).length;

  const pending = suppliers.filter(
    (supplier) => supplier.status === "Pending"
  ).length;

  return (
    <DashboardLayout>
      <div className="supplier-page">
        <div className="supplier-heading">
          <div>
            <h2>Supplier Management</h2>
            <p>Manage and review all water suppliers.</p>
          </div>

          <div className="supplier-heading-icon">
            <FaStore />
          </div>
        </div>

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
              <p>Approved Suppliers</p>
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

        <div className="supplier-table-card">
          <div className="supplier-table-heading">
            <div>
              <h3>All Suppliers</h3>
              <p>View and manage supplier accounts.</p>
            </div>

            <div className="supplier-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="supplier-table-wrapper">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Business</th>
                  <th>Contact</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <div className="supplier-person">
                        <div className="supplier-avatar">
                          {supplier.name.charAt(0)}
                        </div>
                        <span>{supplier.name}</span>
                      </div>
                    </td>

                    <td>{supplier.business}</td>

                    <td>
                      <div className="supplier-contact">
                        <span>
                          <FaEnvelope />
                          {supplier.email}
                        </span>
                        <span>
                          <FaPhoneAlt />
                          {supplier.mobile}
                        </span>
                      </div>
                    </td>

                    <td>{supplier.date}</td>

                    <td>
                      <span
                        className={`supplier-status ${supplier.status.toLowerCase()}`}
                      >
                        {supplier.status}
                      </span>
                    </td>

                    <td>
                      <div className="supplier-actions">
                        {supplier.status !== "Approved" && (
                          <button
                            className="supplier-btn approve"
                            onClick={() =>
                              updateStatus(supplier.id, "Approved")
                            }
                          >
                            Approve
                          </button>
                        )}

                        {supplier.status !== "Rejected" && (
                          <button
                            className="supplier-btn reject"
                            onClick={() =>
                              updateStatus(supplier.id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        )}

                        {supplier.status !== "Blocked" ? (
                          <button
                            className="supplier-btn block"
                            onClick={() =>
                              updateStatus(supplier.id, "Blocked")
                            }
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            className="supplier-btn unblock"
                            onClick={() =>
                              updateStatus(supplier.id, "Approved")
                            }
                          >
                            Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="supplier-empty">
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Supplier;
