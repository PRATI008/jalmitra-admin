
import React, { useState } from "react";
import "../Components/CSS/DashboardLayout.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaUserAlt, FaUsers, FaStore, FaCreditCard, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
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
            title: "Users",
            path: "/user",
            icon: <FaUsers />
        },
        {
            title: "Supplier",
            path: "/supplier",
            icon: <FaStore />
        },
        {
            title: "Subscription",
            path: "/subscription",
            icon: <FaCreditCard />
        }
    ];

    return (
        <div className={`dashboardLayout-outer ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

            <aside className={`dashboardLayout-sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

                <div className="dashboard-top">
                    <div className="sidebar-logo">
                        <img src="/logo.png" alt="JalMitra Logo" />
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
                            <h1>Welcome Admin!</h1>
                            <p>Manage your JalMitra platform from here.</p>
                        </div>
                    </div>

                    <div className="dashboard-Layout-Admin">
                        <div className="dashboard-admin-avatar">
                            <FaUserAlt />
                        </div>
                        <div className="dashboard-admin-info">
                            <h4>Admin</h4>
                            <p>Administrator</p>
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