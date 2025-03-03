import { useContext, useEffect, useState } from "react";
import userProfile from '../Context/userProfile';
import axios from "axios";
import "../assets/ShelterDashboard.css"; // Import CSS
import moment from "moment";

function ShelterDashboard() {
    let user = useContext(userProfile);
    const shelterId = user.userdetails.shelterId;
    const [latestEvents, setLatestEvents] = useState([]);
    const [latestAdoptions, setLatestAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            console.log("Shelter Id into Frontend",shelterId);
            try {
                if (!shelterId) {
                    setError("Shelter ID is missing.");
                    setLoading(false);
                    return;
                }

                // Fetch latest events
                const eventsResponse = await axios.get(`http://localhost:8080/shelter-add-events/${shelterId}`);
                setLatestEvents(eventsResponse.data);

                // Fetch latest adoption requests
                const adoptionsResponse = await axios.get(`http://localhost:8080/latest-adoption/${shelterId}`);
                console.log(adoptionsResponse.data)
                setLatestAdoptions(adoptionsResponse.data.adoptions);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to fetch dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [shelterId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard-container">
            
            <div className="dashboard-content">
                <h2>Shelter Dashboard</h2>


                {/* Latest Events */}
                <div className="dashboard-section">
                    <h3>Latest Events</h3>
                    {latestEvents.length > 0 ? (
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Place</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestEvents.map(event => (
                                    <tr key={event._id}>
                                        <td>{event.eventname}</td>
                                        <td>{event.place}</td>
                                        <td>{new Date(event.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No recent events.</p>
                    )}
                </div>

                {/* Latest Adoption Requests */}
                <div className="dashboard-section">
                    <h3>Latest Adoption Requests</h3>
                    {latestAdoptions.length > 0 ? (
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Pet ID</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestAdoptions.map(request => (
                                    <tr key={request._id}>
                                        <td>{request.petId}</td>
                                        <td>{request.name}</td>
                                        <td>{moment(request.createdAt).format('DD-MM-YYYY')}</td>
                                        <td className={`status-${request.status?.toLowerCase() || "pending"}`}>
                                            {request.status || "Pending"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No recent adoption requests.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShelterDashboard;
