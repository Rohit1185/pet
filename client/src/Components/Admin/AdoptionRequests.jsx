import "../../assets/ManageRequests.css";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function ManageAdoptionRequests() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search Query
  const [filterStatus, setFilterStatus] = useState("All"); // ✅ Filter: Pending, Accepted, Rejected
  const [currentPage, setCurrentPage] = useState(1); // ✅ Pagination
  const requestsPerPage = 5; // ✅ Show 5 requests per page

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/submit-adoption-form");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching adoption requests:", error);
        alert("Failed to fetch adoption requests.");
      }
    };

    fetchRequests();
  }, []);

  // ✅ Filter & Search Requests
  const filteredRequests = requests.filter(req =>
    (filterStatus === "All" || req.status === filterStatus) &&
    (req.petId.toLowerCase().includes(searchQuery.toLowerCase()) ||
     req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     req.shelterId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ✅ Pagination Logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  return (
    <div id="manage-section">
      <div className="manage-header">
        <h2 id="manage-title">📋 Manage Adoption Requests</h2>
        <input
          type="text"
          placeholder="Search Requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select className="filter-dropdown" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <table id="admin-table">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Adopter Email</th>
            <th>Shelter ID</th>
            <th>Status</th>
            <th>Requested Date</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map(req => (
            <tr key={req._id}>
              <td>{req.petId}</td>
              <td>{req.email}</td>
              <td>{req.shelterId}</td>
              <td>{req.status}</td>
              <td>{moment(req.createdAt).format("DD-MM-YYYY")}</td>
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
