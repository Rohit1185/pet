import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import "../assets/showEvent.css"; // Updated CSS file
import { useNavigate } from "react-router-dom";

function EventList() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:8080/shelter-add-events");
                if (response.data) {
                    setEvents(response.data);
                }
            } catch (e) {
                console.log("Error fetching events:", e);
            }
        };
        fetchEvents();
    }, []);

    const handleEventClick = (eventId) => {
        console.log("Navigating to event details:", eventId);
        navigate(`/vieweventdetails/${eventId}`);
    };

    return (
        <div className="event-list-container">
            {events.length > 0 ? (
                events.map((event) => (
                    <div className="event-item" key={event._id}>
                        <img src={`http://localhost:8080/uploads/${event.imgpath}`} alt="Event" className="event-image" />
                        <div className="event-details">
                            <h2 className="event-name">{event.eventname}</h2>
                            <p><strong>Place:</strong> {event.place}</p>
                            <p><strong>Date:</strong> {moment(event.date).utc().format("DD-MM-YYYY")}</p>
                            <p><strong>Time:</strong> {event.time}</p>
                            <p><strong>People Limit:</strong> {event.maxlimit}</p>
                            <p><strong>Category:</strong> {event.category}</p>
                            <p><strong>Organized By:</strong> {event.shelterName}</p>
                            <p><strong>Contact No:</strong> {event.shelterContact}</p>
                            <button className="event-button" onClick={() => handleEventClick(event._id)}>
                                Participate
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-events-message">No Events Available</p>
            )}
        </div>
    );
}

export default EventList;
