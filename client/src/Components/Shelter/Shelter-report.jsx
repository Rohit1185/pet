import { useContext, useEffect, useState } from "react";
import axios from "axios";
import userProfile from "../../Context/userProfile";
import "../assets/shelterReports.css";

function ShelterReports() {
    const user = useContext(userProfile);
    const shelterId = user?.userdetails?.shelterId;
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const [solutions, setSolutions] = useState({});

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/report-shelter/${shelterId}`);
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

        if (shelterId) fetchReports();
    }, [shelterId]);

    const filteredReports = reports.filter(report =>
        filter === "All" ? true : report.status === filter
    );

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredReports.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredReports.length / recordsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // ✅ Handle resolving a report
    const resolveReport = async (reportId) => {
        if (!solutions[reportId]) {
            alert("Please enter a solution before resolving.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/resolve-report/${reportId}`, {
                solution: solutions[reportId]
            });

            if (response.data.success) {
                setReports(reports.map(report =>
                    report._id === reportId ? { ...report, status: "Resolved", solution: solutions[reportId] } : report
                ));
                setSolutions({ ...solutions, [reportId]: "" });
            }
        } catch (err) {
            console.error("Error resolving report:", err);
        }
    };

    return (
        <div className="shelter-reports-container">
            <h2>Received Reports</h2>

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
                                <th>User</th>
                                <th>Reason</th>
                                <th>Details</th>
                                <th>Status</th>
                                <th>Solution</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(report => (
                                <tr key={report._id}>
                                    <td>{report.userId}</td>
                                    <td>{report.reason}</td>
                                    <td>{report.details}</td>
                                    <td className={`status-${report.status.toLowerCase()}`}>{report.status}</td>
                                    <td>{report.solution || "Not provided"}</td>
                                    <td>
                                        {report.status === "Pending" && (
                                            <div className="solution-box">
                                                <input
                                                    type="text"
                                                    value={solutions[report._id] || ""}
                                                    onChange={(e) => setSolutions({ ...solutions, [report._id]: e.target.value })}
                                                    placeholder="Enter solution"
                                                />
                                                <button onClick={() => resolveReport(report._id)}>Resolve</button>
                                            </div>
                                        )}
                                    </td>
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
    );
}

export default ShelterReports;
