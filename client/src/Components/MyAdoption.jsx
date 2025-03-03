import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileSidebar from "../Components/Profilesidebar";
import axios from "axios";
import "../assets/MyAdoption.css";

function AdoptionRequests() {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const recordsPerPage = 5; // Show 5 records per page

    useEffect(() => {
        const fetchAdoptionRequests = async () => {
            try {
                if (!userId) {
                    throw new Error("User ID is missing.");
                }
                const response = await axios.get(`http://localhost:8080/submit-adoption-form/${userId}`);
                console.log(response.data);

                setRequests(response.data);
                setFilteredRequests(response.data);
            } catch (err) {
                console.error("Error fetching adoption requests:", err);
                setError(err.message || "Failed to load adoption requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdoptionRequests();
    }, [userId]);

    // 📌 Filter requests based on status
    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);
        applyFilters(e.target.value, searchTerm);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // 📌 Search Functionality
    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        applyFilters(filter, term);
        setCurrentPage(1); // Reset to first page when searching
    };

    // 📌 Apply Filters (Status + Search)
    const applyFilters = (statusFilter, searchQuery) => {
        let filtered = requests;

        if (statusFilter !== "All") {
            filtered = filtered.filter(req => req.status?.toLowerCase() === statusFilter.toLowerCase());
        }

        if (searchQuery) {
            filtered = filtered.filter(req =>
                req.name?.toLowerCase().includes(searchQuery) ||
                req.email?.toLowerCase().includes(searchQuery) ||
                req.city?.toLowerCase().includes(searchQuery)
            );
        }

        setFilteredRequests(filtered);
    };

    // 📌 Pagination Logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRequests.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / recordsPerPage));

    // 📌 Pagination Handlers
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // 📌 Navigation Handlers
    const handleFeedbackClick = (requestId, shelterId) => navigate(`/feedback-form/${requestId}`, { state: { shelterId } });
    const handleReportClick = (requestId) => navigate(`/report-form/${requestId}`);

    if (loading) return <p className="loading-message">Loading adoption requests...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="adoption-dashboard">
            <ProfileSidebar />
            <div className="adoption-content">
                <h2 className="adoption-title">My Adoption Requests</h2>

                {/* 📌 Filter & Search Section */}
                <div className="filter-search-container">
                    <div className="filter-container">
                        <label htmlFor="filter">Filter by Status:</label>
                        <select id="filter" className="filter-dropdown" value={filter} onChange={handleFilterChange}>
                            <option value="All">All</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by Name, Email, or City..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {currentRecords.length > 0 ? (
                    <>
                        <div className="adoption-table-wrapper">
                            <table className="adoption-table">
                                <thead>
                                    <tr>
                                        <th>Pet ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>City</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((request) => (
                                        <tr key={request._id}>
                                            <td>{request.petId}</td>
                                            <td>{request.name}</td>
                                            <td>{request.email}</td>
                                            <td>{request.city}</td>
                                            <td>{request.reason}</td>
                                            <td className={`status ${request.status?.toLowerCase() || "Pending"}`}>
                                                {request.status || "Pending"}
                                            </td>
                                            <td>
                                                {/* Feedback and Report Buttons */}
                                                <button 
                                                    onClick={() => handleFeedbackClick(request._id, request.shelterId)}
                                                    className="feedback-btn"
                                                    disabled={request.status?.toLowerCase() !== "accepted"}
                                                >
                                                    Give Feedback
                                                </button>
                                                <button 
                                                    onClick={() => handleReportClick(request._id)}
                                                    className="report-btn"
                                                >
                                                    Report Issue
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 📌 Pagination Controls */}
                        <div className="pagination">
                            <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    </>
                ) : (
                    <p className="no-requests">No adoption requests found.</p>
                )}
            </div>
        </div>
    );
}

export default AdoptionRequests;
