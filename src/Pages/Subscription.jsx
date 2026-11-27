import React, { useState, useEffect } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import Modal from 'react-bootstrap/Modal';
import { IoClose } from "react-icons/io5";
import {
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus
} from "react-icons/fa";
import "../Pages/CSS/Subscription.css";
import adminApi from "../services/api";

const Subscription = () => {
  const [search, setSearch] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // New subscription plan form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("1 Month");
  const [features, setFeatures] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchPlans = async () => {
    try {
      const data = await adminApi.getSubscriptions();
      if (Array.isArray(data)) {
        setPlans(data);
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert("Plan name and price are required");
      return;
    }

    setCreating(true);
    try {
      const newPlan = await adminApi.createSubscription({
        name,
        price: Number(price),
        duration,
        features: features || "Clean drinking water delivery with dedicated dispenser support"
      });

      setPlans(prev => [...prev, newPlan]);
      alert("Subscription plan created successfully!");
      setModalShow(false);
      setName("");
      setPrice("");
      setDuration("1 Month");
      setFeatures("");
    } catch (err) {
      alert(err.message || "Failed to create subscription plan");
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await adminApi.updateSubscriptionStatus(id, newStatus);
      setPlans(prev =>
        prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      alert("Failed to update plan status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription plan?")) return;
    try {
      await adminApi.deleteSubscription(id);
      setPlans(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete subscription plan");
    }
  };

  const filteredPlans = plans.filter((plan) =>
    `${plan.name || ''} ${plan.duration || ''} ${plan.features || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activePlans = plans.filter(p => (p.status || "Active") === "Active").length;
  const inactivePlans = plans.filter(p => p.status === "Inactive").length;

  return (
    <DashboardLayout>
      <div className="subscription-page">
        {/* Page Heading */}
        <div className="subscription-heading">
          <div>
            <h2>Subscription Plan Management</h2>
            <p>Define water package plans, recurring schedules, and customer pricing.</p>
          </div>

          <div className="subscription-heading-icon">
            <button
              type="button"
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
              <FaPlus /> Create Subscription Plan
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="subscription-stats">
          <div className="subscription-stat-card">
            <div className="subscription-stat-icon total">
              <FaCreditCard />
            </div>
            <div>
              <p>Total Plans</p>
              <h3>{plans.length}</h3>
            </div>
          </div>

          <div className="subscription-stat-card">
            <div className="subscription-stat-icon active">
              <FaCheckCircle />
            </div>
            <div>
              <p>Active Plans</p>
              <h3>{activePlans}</h3>
            </div>
          </div>

          <div className="subscription-stat-card">
            <div className="subscription-stat-icon inactive">
              <FaClock />
            </div>
            <div>
              <p>Inactive Plans</p>
              <h3>{inactivePlans}</h3>
            </div>
          </div>
        </div>

        {/* Table Panel */}
        <div className="subscription-list-card">
          <div className="subscription-list-heading">
            <div>
              <h3>All Water Subscription Plans</h3>
              <p>View plan details, recurring pricing, and availability status</p>
            </div>

            <div className="subscription-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search plan name, duration, features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="subscription-table-wrapper">
            <table className="subscription-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Features & Inclusions</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td>
                        <div className="subscription-plan-name">
                          <div className="subscription-plan-icon">
                            <FaCreditCard />
                          </div>
                          <span><strong>{plan.name}</strong></span>
                        </div>
                      </td>

                      <td className="subscription-price">
                        ₹{Number(plan.price || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span style={{ fontWeight: '500', color: '#164567' }}>
                          {plan.duration}
                        </span>
                      </td>

                      <td style={{ maxWidth: '300px', fontSize: '12px', color: '#577187' }}>
                        {plan.features}
                      </td>

                      <td>
                        <span
                          className={`subscription-status ${(plan.status || 'Active').toLowerCase()}`}
                        >
                          {plan.status || 'Active'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            className={`subscription-action ${
                              (plan.status || 'Active') === "Active" ? "deactivate" : "activate"
                            }`}
                            onClick={() => toggleStatus(plan.id, plan.status || 'Active')}
                          >
                            <FaEdit />
                            {(plan.status || 'Active') === "Active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(plan.id)}
                            style={{
                              background: '#ffebeb',
                              color: '#dc3545',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '7px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                            title="Delete plan"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="subscription-empty">
                      {loading ? "Loading plans..." : "No subscription plans found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Subscription */}
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          centered
          backdrop="static"
        >
          <Modal.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0" style={{ fontWeight: '700', color: '#12314d' }}>
              Create Subscription Plan
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
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Plan Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Standard 3-Month Plan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 799"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                    Duration
                  </label>
                  <select
                    className="form-control"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2c445a', marginBottom: '5px' }}>
                  Features & Details
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. 1 can daily express delivery with free TDS testing and can sanitization"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
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
                  {creating ? "Creating..." : "Save Plan"}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
