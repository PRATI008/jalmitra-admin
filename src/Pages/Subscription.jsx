import React, { useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import {
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaEdit,
} from "react-icons/fa";
import "../Pages/CSS/Subscription.css";

const Subscription = () => {
  const [search, setSearch] = useState("");

  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic Plan",
      price: 299,
      duration: "1 Month",
      features: "Basic water delivery service",
      status: "Active",
    },
    {
      id: 2,
      name: "Standard Plan",
      price: 799,
      duration: "3 Months",
      features: "Priority delivery service",
      status: "Active",
    },
    {
      id: 3,
      name: "Premium Plan",
      price: 1499,
      duration: "6 Months",
      features: "Priority delivery with extra benefits",
      status: "Inactive",
    },
  ]);

  const toggleStatus = (id) => {
    setPlans((previous) =>
      previous.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              status: plan.status === "Active" ? "Inactive" : "Active",
            }
          : plan
      )
    );
  };

  const filteredPlans = plans.filter((plan) =>
    `${plan.name} ${plan.duration} ${plan.features}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activePlans = plans.filter(
    (plan) => plan.status === "Active"
  ).length;

  const inactivePlans = plans.filter(
    (plan) => plan.status === "Inactive"
  ).length;

  return (
    <DashboardLayout>
      <div className="subscription-page">
        <div className="subscription-heading">
          <div>
            <h2>Subscription Management</h2>
            <p>Manage subscription plans and pricing.</p>
          </div>

          <div className="subscription-heading-icon">
            <FaCreditCard />
          </div>
        </div>

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

        <div className="subscription-list-card">
          <div className="subscription-list-heading">
            <div>
              <h3>All Subscription Plans</h3>
              <p>View plan details and manage availability.</p>
            </div>

            <div className="subscription-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search plans..."
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
                  <th>Features</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <div className="subscription-plan-name">
                        <div className="subscription-plan-icon">
                          <FaCreditCard />
                        </div>
                        <span>{plan.name}</span>
                      </div>
                    </td>

                    <td className="subscription-price">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </td>

                    <td>{plan.duration}</td>

                    <td>{plan.features}</td>

                    <td>
                      <span
                        className={`subscription-status ${plan.status.toLowerCase()}`}
                      >
                        {plan.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className={`subscription-action ${
                          plan.status === "Active" ? "deactivate" : "activate"
                        }`}
                        onClick={() => toggleStatus(plan.id)}
                      >
                        <FaEdit />
                        {plan.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPlans.length === 0 && (
                  <tr>
                    <td colSpan="6" className="subscription-empty">
                      No subscription plans found.
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

export default Subscription;
