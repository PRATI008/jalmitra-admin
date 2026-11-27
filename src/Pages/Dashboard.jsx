import React, { useState, useEffect } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import {
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaRupeeSign,
  FaArrowRight
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../Pages/CSS/Dashboard.css";
import adminApi from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalSubscriptions: 3,
    recentOrders: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(data => {
        if (data) setStats(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const dashboardCards = [
    {
      title: "Total Revenue",
      count: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`,
      change: "+24%",
      icon: <FaRupeeSign />,
      className: "revenue-card"
    },
    {
      title: "Total Users",
      count: stats.totalUsers || 0,
      change: "+12%",
      icon: <FaUsers />,
      className: "users-card"
    },
    {
      title: "Active Suppliers",
      count: stats.totalSuppliers || 0,
      change: "+8%",
      icon: <FaStore />,
      className: "suppliers-card"
    },
    {
      title: "Total Orders",
      count: stats.totalOrders || 0,
      change: "+15%",
      icon: <FaShoppingCart />,
      className: "orders-card"
    },
    {
      title: "Delivered Orders",
      count: stats.deliveredOrders || 0,
      change: "+18%",
      icon: <FaCheckCircle />,
      className: "delivered-card"
    },
    {
      title: "Pending Orders",
      count: stats.pendingOrders || 0,
      change: "",
      icon: <FaClock />,
      className: "pending-card"
    }
  ];

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
        <div className="dashboard-page-heading">
          <div>
            <h2>Dashboard Overview</h2>
            <p>Real-time insights across JalMitra customer app, suppliers and orders.</p>
          </div>

          <div className="dashboard-date">
            <span className="live-pulse"></span>
            <span>Live Platform Activity</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="dashboard-card-outer">
          {dashboardCards.map((card, index) => (
            <div className={`dashboard-card ${card.className}`} key={index}>
              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">{card.icon}</span>
                {card.change && (
                  <span className="dashboard-card-change">
                    <FaArrowUp /> {card.change}
                  </span>
                )}
              </div>

              <div className="dashboard-card-details">
                <p className="dashboard-card-title">{card.title}</p>
                <h2>{card.count}</h2>
                <span className="dashboard-card-caption">
                  {card.change ? "Platform dynamic tally" : "Awaiting fulfillment"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Management Section */}
        <div className="dashboard-bottom-section">
          {/* Recent Orders Overview */}
          <div className="dashboard-info-panel" style={{ flex: 1.5 }}>
            <div className="dashboard-panel-heading">
              <div>
                <h3>Recent Water Orders</h3>
                <p>Latest customer requests across Lucknow</p>
              </div>
              <NavLink to="/orders" className="view-all-link">
                View All <FaArrowRight />
              </NavLink>
            </div>

            <div className="recent-orders-table-wrapper">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <table className="admin-summary-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Water Type</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.slice(0, 5).map((ord) => (
                      <tr key={ord.orderId || ord.id}>
                        <td><strong>#{ord.orderId || ord.id}</strong></td>
                        <td>{ord.userDetails?.name || ord.customerName || "Customer"}</td>
                        <td>{ord.waterType ? `${ord.waterType} Water` : "Normal Water"}</td>
                        <td><span style={{ color: '#0a8fda', fontWeight: '600' }}>₹{ord.totalPrice || 35}</span></td>
                        <td>
                          <span className={`status-pill ${
                            ord.status === "Delivered" ? "pill-delivered" :
                            ord.status === "Cancelled" ? "pill-cancelled" : "pill-pending"
                          }`}>
                            {ord.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#829bb0' }}>
                  No recent orders available.
                </div>
              )}
            </div>
          </div>

          {/* Platform Summary Card */}
          <div className="dashboard-info-panel dashboard-welcome-panel" style={{ flex: 1 }}>
            <div className="dashboard-welcome-icon">
              <FaStore />
            </div>

            <h3>Platform Operations</h3>
            <p>Direct control over customer accounts, supplier vetting and pricing tiers.</p>

            <div className="platform-quick-links">
              <NavLink to="/user" className="quick-btn">
                <FaUsers /> Manage Users ({stats.totalUsers})
              </NavLink>
              <NavLink to="/supplier" className="quick-btn">
                <FaStore /> Manage Suppliers ({stats.totalSuppliers})
              </NavLink>
              <NavLink to="/subscription" className="quick-btn">
                <FaBoxOpen /> Subscription Plans ({stats.totalSubscriptions || 3})
              </NavLink>
            </div>

            <div className="dashboard-status" style={{ marginTop: '20px' }}>
              <span></span>
              All systems online & connected to port 5000
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
