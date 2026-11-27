import React, { useState, useEffect } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import Table from 'react-bootstrap/Table';
import {
  FaSearch,
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTint,
  FaCalendarAlt
} from "react-icons/fa";
import "../Pages/CSS/Orders.css";
import adminApi from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await adminApi.getOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (String(o.orderId || o.id) === String(orderId) ? { ...o, status: newStatus } : o))
      );
      alert(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = `${o.orderId || o.id || ''} ${o.userDetails?.name || o.customerName || ''} ${o.userDetails?.mobile || ''} ${o.waterType || ''}`
      .toLowerCase()
      .includes(search.toLowerCase());

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Delivered") return matchesSearch && o.status === "Delivered";
    if (activeFilter === "Cancelled") return matchesSearch && o.status === "Cancelled";
    if (activeFilter === "Pending") return matchesSearch && o.status !== "Delivered" && o.status !== "Cancelled";
    return matchesSearch;
  });

  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const pendingCount = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

  return (
    <DashboardLayout>
      <div className="admin-orders-page">
        {/* Header */}
        <div className="admin-orders-heading">
          <div>
            <h2>Platform Water Orders</h2>
            <p>Live tracking of customer requests, supplier assignments, and fulfillment.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="orders-stats-row">
          <div className="order-stat-box" onClick={() => setActiveFilter("All")}>
            <div className="stat-ico total-ico"><FaShoppingCart /></div>
            <div>
              <p>Total Orders</p>
              <h3>{orders.length}</h3>
            </div>
          </div>

          <div className="order-stat-box" onClick={() => setActiveFilter("Delivered")}>
            <div className="stat-ico delivered-ico"><FaCheckCircle /></div>
            <div>
              <p>Delivered</p>
              <h3>{deliveredCount}</h3>
            </div>
          </div>

          <div className="order-stat-box" onClick={() => setActiveFilter("Pending")}>
            <div className="stat-ico pending-ico"><FaClock /></div>
            <div>
              <p>Pending / In-Transit</p>
              <h3>{pendingCount}</h3>
            </div>
          </div>

          <div className="order-stat-box" onClick={() => setActiveFilter("Cancelled")}>
            <div className="stat-ico cancel-ico"><FaTimesCircle /></div>
            <div>
              <p>Cancelled</p>
              <h3>{cancelledCount}</h3>
            </div>
          </div>
        </div>

        {/* Orders Card Panel */}
        <div className="orders-table-card">
          <div className="orders-card-toolbar">
            <div className="orders-filter-chips">
              {["All", "Pending", "Delivered", "Cancelled"].map((f) => (
                <button
                  key={f}
                  className={`filter-chip ${activeFilter === f ? "active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f === "All" ? "All Orders" : f}
                </button>
              ))}
            </div>

            <div className="orders-search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search order ID, customer name, mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="orders-table-wrapper">
            <Table responsive hover className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Details</th>
                  <th>Delivery Address</th>
                  <th>Product & Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((ord) => {
                    const id = ord.orderId || ord.id;
                    const custName = ord.userDetails?.name || ord.customerName || "Customer";
                    const mobile = ord.userDetails?.mobile || ord.customerMobile || "+91 98765 43210";
                    const address = ord.userDetails?.currentLocation || ord.userDetails?.location || ord.userDetails?.address || "Aliganj, Lucknow";
                    const date = ord.orderDate || ord.date || "Today";
                    const status = ord.status || "Pending";

                    return (
                      <tr key={id}>
                        <td>
                          <strong>#{id}</strong>
                          <span style={{ fontSize: '11px', color: '#7e96aa', display: 'block' }}>
                            <FaCalendarAlt style={{ marginRight: '4px' }} />
                            {date}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontWeight: '600', color: '#163b58' }}>{custName}</div>
                          <span style={{ fontSize: '12px', color: '#5b7891' }}>
                            <FaPhoneAlt style={{ marginRight: '4px' }} />
                            {mobile}
                          </span>
                        </td>

                        <td style={{ maxWidth: '220px', fontSize: '12px', color: '#4a677f' }}>
                          <FaMapMarkerAlt style={{ color: '#0a8fda', marginRight: '4px' }} />
                          {address}
                        </td>

                        <td>
                          <div style={{ fontWeight: '600', color: '#0a8fda' }}>
                            <FaTint style={{ marginRight: '4px' }} />
                            {ord.waterType ? `${ord.waterType} Water` : "Normal Water"}
                          </div>
                          <span style={{ fontSize: '11px', color: '#688296' }}>
                            Quantity: {ord.quantity || 1} × 20L
                          </span>
                        </td>

                        <td>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#12314d' }}>
                            ₹{ord.totalPrice || 35}
                          </div>
                          <span style={{ fontSize: '11px', color: '#099268', fontWeight: '600' }}>
                            {ord.paymentMethod || "COD"}
                          </span>
                        </td>

                        <td>
                          <span className={`status-badge ${
                            status === "Delivered" ? "badge-delivered" :
                            status === "Cancelled" ? "badge-cancelled" : "badge-pending"
                          }`}>
                            {status}
                          </span>
                        </td>

                        <td>
                          <select
                            className="order-status-select"
                            value={status}
                            onChange={(e) => handleUpdateStatus(id, e.target.value)}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#8aa1b4' }}>
                      {loading ? "Loading orders..." : "No orders found for this criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;

