import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/SideBar/SideBar";
import axios from "axios"; 
import "./ManageUsers.css";
import useNotificationToast from "../../../components/NotificationToast/NotificationToast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const notify = useNotificationToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/manage-users/");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete-user/${userId}/`
      );
      if (response.status === 200) {
        setUsers(users.filter((user) => user.user_id !== userId));

        notify({
          message: "User deleted successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);

      notify({
        message: "Failed to delete user.",
        type: "error",
      });
    }
  };

  // Sort users (Admin first)
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return 0;
  });

  return (
    <div className="manage-users-page">
      <div className="users-dashboard">
        <Sidebar />
        <main className="manage-users-content">
          <h1 className="manage-users-heading">Manage Users</h1>
          <table className="users-table">
            <thead>
              <tr>
                <th></th>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.user_id}>
                  <td className="delete-cell">
                    {user.role === "user" && (
                      <button
                        onClick={() => handleDelete(user.user_id)}
                        className="delete-button"
                      >
                        ×
                      </button>
                    )}
                  </td>
                  <td>{user.user_id ? user.user_id.substring(0, 8) : "N/A"}</td>{" "}
                  {/* Show only first 8 chars */}
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;
