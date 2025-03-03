import "../../assets/ManageUsers.css";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function ManageShelters() {
  const [shelters, setShelters] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search Query
  const [currentPage, setCurrentPage] = useState(1); // ✅ Pagination State
  const sheltersPerPage = 5; // ✅ Show 5 shelters per page
  const [editingShelterId, setEditingShelterId] = useState(null);
  const [editableShelter, setEditableShelter] = useState(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await axios.get("http://localhost:8080/registerusers");
        const shelterUsers = response.data.filter(user => user.isShelter === "YES");
        setShelters(shelterUsers);
      } catch (error) {
        console.error("Error fetching shelters:", error);
        alert("Failed to fetch shelters.");
      }
    };
    fetchShelters();
  }, []);

  // ✅ Toggle Shelter Status (Enable/Disable)
  const toggleShelterStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Enabled" ? "Disabled" : "Enabled";
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this shelter?`)) {
      try {
        await axios.put(`http://localhost:8080/registerusers/${userId}`, { status: newStatus });
        setShelters(shelters.map(shelter => (shelter.userId === userId ? { ...shelter, status: newStatus } : shelter)));
        alert(`Shelter ${newStatus.toLowerCase()} successfully!`);
      } catch (error) {
        console.error(`Error updating shelter status:`, error);
        alert("Failed to update shelter status.");
      }
    }
  };

  // ✅ Enable Editing Mode
  const startEditing = (shelter) => {
    setEditingShelterId(shelter.userId);
    setEditableShelter({ ...shelter });
  };

  // ✅ Handle Input Changes
  const handleChange = (e, field) => {
    setEditableShelter({ ...editableShelter, [field]: e.target.value });
  };

  // ✅ Save Updated Shelter
  const saveShelter = async () => {
    try {
      await axios.put(`http://localhost:8080/registerusers/${editableShelter.userId}`, editableShelter);
      setShelters(shelters.map(shelter => (shelter.userId === editableShelter.userId ? editableShelter : shelter)));
      alert("Shelter updated successfully!");
      setEditingShelterId(null);
      setEditableShelter(null);
    } catch (error) {
      console.error("Error updating shelter:", error);
      alert("Failed to update shelter.");
    }
  };

  // ✅ Filter Shelters Based on Search Query
  const filteredShelters = shelters.filter(shelter =>
    shelter.shelterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const indexOfLastShelter = currentPage * sheltersPerPage;
  const indexOfFirstShelter = indexOfLastShelter - sheltersPerPage;
  const currentShelters = filteredShelters.slice(indexOfFirstShelter, indexOfLastShelter);
  const totalPages = Math.ceil(filteredShelters.length / sheltersPerPage);

  return (
    <div id="manage-section">
      <div className="manage-header">
        <h2 id="manage-title">🐾 Manage Shelters</h2>
        <input
          type="text"
          placeholder="Search Shelters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table id="admin-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Shelter Name</th>
            <th>Owner</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Registered Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentShelters.map(shelter => (
            <tr key={shelter._id}>
              <td>
                <img src={shelter.userImg ? `http://localhost:8080/uploads/${shelter.userImg}` : "/default-user.png"} 
                     alt="Shelter" id="user-img" />
              </td>
              <td>
                {editingShelterId === shelter.userId ? (
                  <input type="text" value={editableShelter.shelterName} onChange={(e) => handleChange(e, "shelterName")} />
                ) : (
                  shelter.shelterName
                )}
              </td>
              <td>
                {editingShelterId === shelter.userId ? (
                  <input type="text" value={editableShelter.userFname} onChange={(e) => handleChange(e, "userFname")} />
                ) : (
                  `${shelter.userFname} ${shelter.userLname}`
                )}
              </td>
              <td>{shelter.userEmail}</td>
              <td>{shelter.shelterContact}</td>
              <td>{shelter.shelterAddress}</td>
              <td>{moment(shelter.createdAt).format("DD-MM-YYYY")}</td>
              <td className={shelter.status === "Enabled" ? "status-enabled" : "status-disabled"}>
                {shelter.status}
              </td>
              <td>
                {editingShelterId === shelter.userId ? (
                  <>
                    <button id="save-btn" onClick={saveShelter}>Save</button>
                    <button id="cancel-btn" onClick={() => setEditingShelterId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button id="update-btn" onClick={() => startEditing(shelter)}>Edit</button>
                    <button 
                      id={shelter.status === "Enabled" ? "disable-btn" : "enable-btn"} 
                      onClick={() => toggleShelterStatus(shelter.userId, shelter.status)}
                    >
                      {shelter.status === "Enabled" ? "Disable" : "Enable"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination Buttons */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
