import { useState, useEffect } from "react";

import axios from "axios";
import moment from "moment";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [editingUserId, setEditingUserId] = useState(null);
  const [editableUser, setEditableUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/registerusers");
        const normalUsers = response.data
          .filter((user) => user.isShelter === "NO")
          .map((user) => ({
            ...user,
            status: user.status || "Enabled", // Default to Enabled
          }));
        setUsers(normalUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);


  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Enabled" ? "Disabled" : "Enabled";

    try {
      await axios.put(`http://localhost:8080/registerusers/${userId}`, {
        status: newStatus,
      });

      setUsers(
        users.map((user) =>
          user.userId === userId ? { ...user, status: newStatus } : user
        )
      );

      alert(`User ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error updating user status:`, error);
      alert("Failed to update user status.");
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user.userId);
    setEditableUser({ ...user });
  };

  const handleChange = (e, field) => {
    setEditableUser({ ...editableUser, [field]: e.target.value });
  };

  const saveUser = async () => {
    if (!editableUser) return;

    try {
      await axios.put(
        `http://localhost:8080/registerusers/${editableUser.userId}`,
        editableUser
      );
      setUsers(
        users.map((user) =>
          user.userId === editableUser.userId ? editableUser : user
        )
      );
      alert("User updated successfully!");
      setEditingUserId(null);
      setEditableUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userFname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div id="manage-section">
      <div className="manage-header">
        <h2 id="manage-title">👥 Manage Users</h2>
        <input
          type="text"
          placeholder="Search Users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table id="admin-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Status</th>
            
            <th>Registered Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id}>
              <td>
                <img
                  src={
                    user.userImg
                      ? `http://localhost:8080/uploads/${user.userImg}`
                      : "/default-user.png"
                  }
                  alt="User"
                  id="user-img"
                />
              </td>

              <td>{user.userId}</td>

              <td>
                {editingUserId === user.userId && editableUser ? (
                  <input
                    type="text"
                    value={editableUser.userFname}
                    onChange={(e) => handleChange(e, "userFname")}
                  />
                ) : (
                  `${user.userFname}`
                )}
              </td>


<td>
  {editingUserId === user.userId && editableUser ? (
    <input
      type="email"
      value={editableUser.userEmail}
      onChange={(e) => handleChange(e, "userEmail")}
    />
  ) : (
    user.userEmail
  )}
</td>

<td>
  {editingUserId === user.userId && editableUser ? (
    <input
      type="text"
      value={editableUser.userContact}
      onChange={(e) => handleChange(e, "userContact")}
    />
  ) : (
    user.userContact
  )}
</td>


              <td>
                <span
                  className={
                    user.status === "Enabled" ? "status-enabled" : "status-disabled"
                  }
                >
                  {user.status}
                </span>
              </td>

             

              <td>{moment(user.createdAt).format("DD-MM-YYYY")}</td>

              <td>
                {editingUserId === user.userId ? (
                  <>
                    <button id="save-btn" onClick={saveUser}>
                      Save
                    </button>
                    <button id="cancel-btn" onClick={() => setEditingUserId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button id="update-btn" onClick={() => startEditing(user)}>
                      Update
                    </button>
                    <button
                      id={user.status === "Enabled" ? "disable-btn" : "enable-btn"}
                      onClick={() => toggleUserStatus(user.userId, user.status)}
                    >
                      {user.status === "Enabled" ? "Disable" : "Enable"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={currentPage === i + 1 ? "active-page" : ""} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
