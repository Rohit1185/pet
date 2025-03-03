import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileSidebar from "../Components/Profilesidebar";
import "../assets/AdoptionReq.css";

function AdoptionRequests() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdoptionRequests = async () => {
            try {
                if (!userId) {
                    setError("Shelter ID is missing.");
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`http://localhost:8080/submit-adoption-application/${userId}`);
                setRequests(response.data);
            } catch (err) {
                console.error("Error fetching adoption requests:", err);
                setError("Failed to load adoption requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchAdoptionRequests();
    }, [userId]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:8080/submit-adoption-application/${id}`, { status: newStatus });
            if (response.data.success) {
                setRequests((prevRequests) =>
                    prevRequests.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
                );
            } else {
                alert("Failed to update status. Try again.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error occurred while updating status.");
        }
    };

    const handleViewApplication = (petId) => {
        navigate(`/view-application/${petId}`);
    };
    const handleFeedbackClick = (requestId, userId) => navigate(`/feedback-form/${requestId}`, { state: { userId } });

    const handleReport = (giverId, receiverId, giverRole) => {
        navigate("/report-form", { state: { giverId, receiverId, giverRole } });
    };

    if (loading) return <p className="loading-text">Loading...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="adoption-dashboard">
            <ProfileSidebar />
            <div className="adoption-content">
                <h2 className="adoption-heading">Manage Adoption Requests</h2>
                {requests.length > 0 ? (
                    <div className="table-container">
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
                                    <th>Feedback</th>
                                    <th>Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request._id}>
                                        <td>{request.petId}</td>
                                        <td>{request.name}</td>
                                        <td>{request.email}</td>
                                        <td>{request.city}</td>
                                        <td>{request.reason}</td>
                                        <td className={`status-tag ${request.status?.toLowerCase() || "pending"}`}>
                                            {request.status || "Pending"}
                                        </td>
                                        <td>
                                            <button className="btn-accept" onClick={() => handleStatusUpdate(request._id, "Accepted")}>Accept</button>
                                            <button className="btn-reject" onClick={() => handleStatusUpdate(request._id, "Rejected")}>Reject</button>
                                            <button className="btn-view" onClick={() => handleViewApplication(request.petId)}>View Application</button>
                                        </td>
                                        <td>
                                        <button 
                                                    onClick={() => handleFeedbackClick(request._id, request.userId)}
                                                    className="feedback-btn">
                                                    Give Feedback
                                                </button>
                                        </td>
                                        <td>
                                            <button className="btn-report" onClick={() => handleReport(userId, request._id, "Shelter")}>Report Issue</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-requests">No adoption requests found.</p>
                )}
            </div>
        </div>
    );
}

export default AdoptionRequests;
