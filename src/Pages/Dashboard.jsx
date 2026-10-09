
import React from "react";
import DashboardLayout from "../Components/DashboardLayout";
import {
    FaUsers,
    FaStore,
    FaBoxOpen,
    FaShoppingCart,
    FaCheckCircle,
    FaClock,
    FaArrowUp
} from "react-icons/fa";
import "../Pages/CSS/Dashboard.css";

const Dashboard = () => {
    const dashboardCards = [
        {
            title: "Total Users",
            count: "3,460",
            change: "8%",
            icon: <FaUsers />,
            className: "users-card"
        },
        {
            title: "Total Suppliers",
            count: "456",
            change: "5%",
            icon: <FaStore />,
            className: "suppliers-card"
        },
        {
            title: "Total Products",
            count: "460",
            change: "12%",
            icon: <FaBoxOpen />,
            className: "products-card"
        },
        {
            title: "Total Orders",
            count: "8,990",
            change: "15%",
            icon: <FaShoppingCart />,
            className: "orders-card"
        },
        {
            title: "Delivered Orders",
            count: "7,850",
            change: "18%",
            icon: <FaCheckCircle />,
            className: "delivered-card"
        },
        {
            title: "Pending Orders",
            count: "125",
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
                        <p>Welcome back! Here's what's happening with JalMitra.</p>
                    </div>

                    <div className="dashboard-date">
                        <span>Admin Panel</span>
                    </div>
                </div>

                <div className="dashboard-card-outer">
                    {dashboardCards.map((card, index) => (
                        <div
                            className={`dashboard-card ${card.className}`}
                            key={index}
                        >
                            <div className="dashboard-card-top">
                                <span className="dashboard-card-icon">
                                    {card.icon}
                                </span>

                                {card.change && (
                                    <span className="dashboard-card-change">
                                        <FaArrowUp /> {card.change}
                                    </span>
                                )}
                            </div>

                            <div className="dashboard-card-details">
                                <p className="dashboard-card-title">
                                    {card.title}
                                </p>

                                <h2>{card.count}</h2>

                                <span className="dashboard-card-caption">
                                    {card.change
                                        ? "Compared to last week"
                                        : "Orders awaiting action"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-bottom-section">
                    <div className="dashboard-info-panel">
                        <div className="dashboard-panel-heading">
                            <div>
                                <h3>JalMitra Summary</h3>
                                <p>Your platform at a glance</p>
                            </div>
                            <FaBoxOpen />
                        </div>

                        <div className="dashboard-summary-row">
                            <span>Registered Users</span>
                            <strong>3,460</strong>
                        </div>

                        <div className="dashboard-summary-row">
                            <span>Active Suppliers</span>
                            <strong>456</strong>
                        </div>

                        <div className="dashboard-summary-row">
                            <span>Available Products</span>
                            <strong>460</strong>
                        </div>
                    </div>

                    <div className="dashboard-info-panel dashboard-welcome-panel">
                        <div className="dashboard-welcome-icon">
                            <FaStore />
                        </div>

                        <h3>Manage JalMitra</h3>

                        <p>
                            Keep track of your users, suppliers and
                            subscriptions from one place.
                        </p>

                        <div className="dashboard-status">
                            <span></span>
                            Admin dashboard is ready
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Dashboard;