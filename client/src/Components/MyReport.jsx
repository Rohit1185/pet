import { useContext, useEffect, useState } from "react";
import axios from "axios";
import userProfile from "../Context/userProfile";
import ProfileSidebar from '../Components/Profilesidebar'
import "../assets/myReports.css";

function MyReports() {
    const user = useContext(userProfile);
    const userId = user?.userdetails?.userId;
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All"); // Filter state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5; // 📌 Show 5 records per page
    
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/my-reports/${userId}`);
                if (response.data.success) {
                    setReports(response.data.reports);
                } else {
                    setError("No reports found.");
                }
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("Failed to load reports.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchReports();
    }, [userId]);

    // ✅ Handle filtering by report status
    const filteredReports = reports.filter(report =>
        filter === "All" ? true : report.status === filter
    );

    // ✅ Pagination Logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredReports.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredReports.length / recordsPerPage);

    // ✅ Handle Next & Previous Page
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="my-reports-container">
            <div className="profile-info-report">
                <ProfileSidebar/>
            </div>
            <div className="report-info">
            <h2>My Reports</h2>

            {/* 📌 Filter Dropdown */}
            <div className="filter-container">
                <label htmlFor="filter">Filter by Status:</label>
                <select id="filter" className="filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && currentRecords.length > 0 ? (
                <>
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Reason</th>
                                <th>Details</th>
                                <th>Status</th>
                                <th>Solution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(report => (
                                <tr key={report._id}>
                                    <td>{report.reason}</td>
                                    <td>{report.details}</td>
                                    <td className={`status-${report.status.toLowerCase()}`}>{report.status}</td>
                                    <td>{report.solution || "Not provided"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 📌 Pagination Controls */}
                    <div className="pagination">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </>
            ) : (
                !loading && <p>No reports available.</p>
            )}
            </div>
        </div>
    );
}

export default MyReports;
