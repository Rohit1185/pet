import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileSidebar from "../Components/Profilesidebar";
import "../assets/ViewEventByUser.css"; // Import CSS file

function ViewEventByUser() {
    const { userId } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [participators, setParticipators] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        console.log("Fetching events for user:", userId);
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/events-by-user/${userId}`);
                setEvents(response.data);
            } catch (error) {
                setError("Error fetching events.",error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [userId]);

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await axios.delete(`http://localhost:8080/delete-event/${eventId}`);
                setEvents(events.filter(event => event._id !== eventId)); // Remove deleted event from state
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete the event.");
            }
        }
    };

    const handleViewParticipators = async (eventId) => {
        try {
            const response = await axios.get(`http://localhost:8080/event-participators/${eventId}`);
            setParticipators(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching participators:", error);
            alert("Failed to fetch participators.");
        }
    };

    return (
        <div className="event-container">
            <ProfileSidebar />
            <div className="event-content">
                {loading && <p>Loading events...</p>}
                {error && <p className="error-message">{error}</p>}
                {events.length > 0 ? (
                    <table className="event-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Place</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event._id}>
                                    <td>{event.eventname}</td>
                                    <td>{event.place}</td>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td>{event.time}</td>
                                    <td>{event.category}</td>
                                    <td>
                                        <button 
                                            className="view-button"
                                            onClick={() => handleViewParticipators(event._id)}
                                        >
                                            View Participators
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDelete(event._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No events found for this user.</p>
                )}
            </div>

            {/* Modal for Participators List */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Participators List</h3>
                        <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
                        {participators.length > 0 ? (
                            <table className="participator-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participators.map(participant => (
                                        <tr key={participant._id}>
                                            <td>{participant.name}</td>
                                            <td>{participant.email}</td>
                                            <td>{participant.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No participators found for this event.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewEventByUser;
