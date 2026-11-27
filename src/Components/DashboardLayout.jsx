import React, { useState, useEffect } from "react";
import "../Components/CSS/DashboardLayout.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUserAlt,
  FaUsers,
  FaStore,
  FaCreditCard,
  FaTachometerAlt,
  FaSignOutAlt,
  FaShoppingCart
} from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import adminApi from "../services/api";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState({ name: 'Admin', role: 'Administrator' });
  const navigate = useNavigate();

  useEffect(() => {
    const user = adminApi.getStoredAdmin();
    if (user) {
      setAdminUser(user);
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      adminApi.logout();
      navigate("/");
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />
    },
    {
      title: "All Orders",
      path: "/orders",
      icon: <FaShoppingCart />
    },
    {
      title: "Users",
      path: "/user",
      icon: <FaUsers />
    },
    {
      title: "Suppliers",
      path: "/supplier",
      icon: <FaStore />
    },
    {
      title: "Subscriptions",
      path: "/subscription",
      icon: <FaCreditCard />
    }
  ];

  return (
    <div className={`dashboardLayout-outer ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <aside className={`dashboardLayout-sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="dashboard-top">
          <div className="sidebar-logo">
            <span style={{ fontSize: '26px' }}>💧</span>
          </div>
          {sidebarOpen && (
            <div className="sidebar-brand-text">
              <h2>JalMitra</h2>
              <p>Admin Panel</p>
            </div>
          )}
        </div>

        <div className="sidebar-section-title">
          {sidebarOpen && "MAIN MENU"}
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!sidebarOpen ? item.title : ""}
              className={({ isActive }) =>
                `navLink ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-menu-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button onClick={handleLogout} title={!sidebarOpen ? "Logout" : ""}>
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="dashboardLayout-main">
        <header className="dashboardLayout-header">
          <div className="header-first">
            <button
              type="button"
              className="dashboard-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <IoCloseSharp /> : <FaBars />}
            </button>

            <div className="dashboard-welcome">
              <h1>Welcome, {adminUser.name || 'Admin'}!</h1>
              <p>Manage your JalMitra water supply ecosystem.</p>
            </div>
          </div>

          <div className="dashboard-Layout-Admin">
            <div className="dashboard-admin-avatar">
              <FaUserAlt />
            </div>
            <div className="dashboard-admin-info">
              <h4>{adminUser.name || 'Admin'}</h4>
              <p>{adminUser.role || 'Super Admin'}</p>
            </div>
          </div>
        </header>

        <section className="dashboardLayout-content">
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
