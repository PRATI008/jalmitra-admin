
import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import axios from "axios";
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import { IoClose, IoMenu } from "react-icons/io5";
import {
    FaSearch,
    FaUsers,
    FaUserCircle,
    FaEnvelope,
    FaPhoneAlt,
    FaUserSlash
} from "react-icons/fa";
import "../Pages/CSS/Users.css";

const Users = () => {
    const [search, setSearch] = useState("");

    const [users, setUsers] = useState([])
    const [modalShow, setModalShow] = useState(false)

    const fetchUsers = async()=>{
        try{
            const res = await axios.get("./Data/users.json")
            setUsers(res.data)
            console.log();
            } catch (error){
                console.log(error);
                
            }
    }

    useEffect(()=>{
        fetchUsers()
    },[])
       

    const toggleStatus = (id) => {
        setUsers((previousUsers) =>
            previousUsers.map((user) =>
                user.id === id
                    ? {
                        ...user,
                        status: user.status === "Active" ? "Blocked" : "Active"
                    }
                    : user
            )
        );
    };

    const filteredUsers = users.filter((user) =>
        `${user.name} ${user.email} ${user.mobile}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const activeUsers = users.filter(
        (user) => user.status === "Active"
    ).length;

    const blockedUsers = users.filter(
        (user) => user.status === "Blocked"
    ).length;

    return (
       <>
        <DashboardLayout>
           

            <div className="users-page">
                 <div className="user-Modal">
                <h3>Add Users</h3>
                <button onClick={()=>setModalShow(true)}>Create Users</button>
            </div>

                <div className="users-page-heading">
                    <div>
                        <h2>User Management</h2>
                        <p>Manage all registered JalMitra customers.</p>
                    </div>

                    <div className="users-total-badge">
                        <FaUsers />
                        <span>{users.length} Total Users</span>
                    </div>
                </div>

                <div className="users-stats">
                    <div className="users-stat-card">
                        <div className="users-stat-icon total-users-icon">
                            <FaUsers />
                        </div>
                        <div>
                            <p>Total Users</p>
                            <h3>{users.length}</h3>
                        </div>
                    </div>

                    <div className="users-stat-card">
                        <div className="users-stat-icon active-users-icon">
                            <FaUserCircle />
                        </div>
                        <div>
                            <p>Active Users</p>
                            <h3>{activeUsers}</h3>
                        </div>
                    </div>

                    <div className="users-stat-card">
                        <div className="users-stat-icon blocked-users-icon">
                            <FaUserSlash />
                        </div>
                        <div>
                            <p>Blocked Users</p>
                            <h3>{blockedUsers}</h3>
                        </div>
                    </div>
                </div>

                <div className="users-table-panel">

                    <div className="users-table-toolbar">
                        <div>
                            <h3>All Users</h3>
                            <p>View and manage registered customers</p>
                        </div>

                        <div className="users-search">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search name, email or mobile..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="users-table-scroll">
                        <Table className="users-table" striped bordered>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Contact Details</th>
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
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <strong>{user.name}</strong>
                                                        <span>Customer #{user.id}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="users-contact-cell">
                                                    <span>
                                                        <FaEnvelope />
                                                        {user.email}
                                                    </span>
                                                    <span>
                                                        <FaPhoneAlt />
                                                        {user.mobile}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>{user.joined}</td>

                                            <td>
                                                <span
                                                    className={`users-status ${
                                                        user.status === "Active"
                                                            ? "status-active"
                                                            : "status-blocked"
                                                    }`}
                                                >
                                                    <span className="users-status-dot"></span>
                                                    {user.status}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    className={`users-action-btn ${
                                                        user.status === "Active"
                                                            ? "block-user-btn"
                                                            : "unblock-user-btn"
                                                    }`}
                                                    onClick={() => toggleStatus(user.id)}
                                                >
                                                    {user.status === "Active"
                                                        ? "Block"
                                                        : "Unblock"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="users-empty">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="users-table-footer">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>

                </div>
            </div>




            <Modal  show={modalShow}
    onHide={() => setModalShow(false)}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    backdrop="static"
    keyboard={false}
    dialogClassName="users-create-modal"
>
               <Modal.Header className="d-flex justify-content-between align-items-center">
    <h3 className="mb-0">Create User</h3>

    <button
        type="button"
        className="btn btn-dark p-2"
        onClick={() => setModalShow(false)}
    >
        <IoClose />
    </button>
</Modal.Header>
                   <Modal.Body>
    <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
        />
    </div>
</Modal.Body>
               
            </Modal>
        </DashboardLayout>
       </>
    );
};

export default Users;