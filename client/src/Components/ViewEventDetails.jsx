import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import userProfile from '../Context/userProfile';
import '../assets/eventdetails.css';

function ViewEventDetails() {
    const user = useContext(userProfile)

    // let userId = user.userdetails.userId
    const { shelterId } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [participant, setParticipant] = useState({ name: "", email: "", phone: "", });

    useEffect(() => {
        const viewEventDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/vieweventdetails/${shelterId}`);
                if (response.data) {
                    setEventDetails(response.data);
                }
            } catch (e) {
                setError("Error fetching event details.");
                console.log("Error while fetching data", e);
            } finally {
                setLoading(false);
            }
        };

        viewEventDetails();
    }, [shelterId]);

    const handleInputChange = (e) => {
        setParticipant({ ...participant, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("event details",eventDetails)
            const response = await axios.post("http://localhost:8080/participate", { ...participant, eventId: eventDetails._id,userId:user.userdetails.userId,shelterId:eventDetails.ShelterId });
            if (response.data.success) {
                alert("Participation successful!");
            } else {
                alert("Failed to store participation data.");
            }
        } catch (err) {
            alert("Error submitting participation form.", err);
        }
    };

    return (
        <div className="event-wrapper">
            {loading && <p className="event-loading">Loading event details...</p>}
            {error && <p className="event-error">{error}</p>}
            
            {eventDetails ? (
                <div className="event-box">
                    <img
                        src={`http://localhost:8080/uploads/${eventDetails.imgpath}`}
                        alt="Event"
                        className="event-image"
                    />
                    <div className="event-content">
                        <h2 className="event-heading">{eventDetails.eventname}</h2>
                        <p><strong>Place:</strong> {eventDetails.place}</p>
                        <p><strong>Date:</strong> {moment(eventDetails.date).utc().format("DD-MM-YYYY")}</p>
                        <p><strong>Time:</strong> {eventDetails.time}</p>
                        <p><strong>People Limit:</strong> {eventDetails.maxlimit}</p>
                        <p><strong>Category:</strong> {eventDetails.category}</p>
                        <p><strong>Organized By:</strong> {eventDetails.shelterName}</p>
                        <p><strong>Contact No:</strong> {eventDetails.shelterContact}</p>
                    </div>
                    <div className="participation-section">
                        <h3>Participate in this Event</h3>
                        <form onSubmit={handleFormSubmit}>
                            <input type="text" name="name" placeholder="Your Name" value={participant.name} onChange={handleInputChange} required className="input-field" />
                            <input type="email" name="email" placeholder="Your Email" value={participant.email} onChange={handleInputChange} required className="input-field" />
                            <input type="tel" name="phone" placeholder="Your Phone Number" value={participant.phone} onChange={handleInputChange} required className="input-field" />
                            <button type="submit" className="submit-btn">Register</button>
                        </form>
                    </div>
                </div>
            ) : (
                <p className="event-not-found">Event Not Found</p>
            )}
        </div>
    );
}

export default ViewEventDetails;
