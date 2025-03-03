import { useEffect, useState, useContext } from "react";
import axios from "axios";
import userProfile from "../Context/userProfile";
import moment from "moment";
import ProfileSidebar from "../Components/Profilesidebar";
import "../assets/myeventparticipation.css";

function MyEventParticipation() {
    const user = useContext(userProfile); // Get logged-in user details
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5; // Change as needed

    // Ensure userId exists
    const userId = user?.userdetails?.userId;

    useEffect(() => {
        const fetchUserParticipations = async () => {
            if (!userId) {
                setError("User not logged in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/myeventparticipations/${userId}`);

                if (response.data.success) {
                    setEvents(response.data.events);
                } else {
                    setError("No event participations found.");
                }
            } catch (err) {
                setError("Error fetching event participation details.");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserParticipations();
    }, [userId]);

    // Search filter
    const filteredEvents = events.filter(event =>
        event.eventname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    return (
        <div className="event-participation-wrapper">
            <div>
                <ProfileSidebar />
            </div>
            <div className="event-participation-info">
                <h2>My Event Participations</h2>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search events..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && currentEvents.length > 0 ? (
                    <>
                        <table className="event-table">
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Place</th>
                                    <th>Organizer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEvents.map((event) => (
                                    <tr key={event._id}>
                                        <td>{event.eventname || "N/A"}</td>
                                        <td>{moment(event.date).utc().format("DD-MM-YYYY")}</td>
                                        <td>{event.time || "N/A"}</td>
                                        <td>{event.place || "N/A"}</td>
                                        <td>{event.shelterName || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="pagination">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            <span> Page {currentPage} of {totalPages} </span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    !loading && <p className="no-events">No event participations found.</p>
                )}
            </div>
        </div>
    );
}

export default MyEventParticipation;
