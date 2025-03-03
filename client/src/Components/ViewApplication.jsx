import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useContext } from "react";
import userProfile from "../Context/userProfile";
import axios from "axios";
import "../assets/viewApplication.css";

function ViewApplication() {
    const { petId } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useContext(userProfile); 
    const shelterId = user.userdetails.shelterId;

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/view-application/${petId}`);
                console.log(response.data);
                setApplication(response.data.data);
            } catch (err) {
                console.error("Error fetching application details:", err);
                setError("Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, [petId]);

    if (loading) return <p className="loading-text">Loading...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="application-container">
            <h2>Adoption Application Details</h2>
            {application ? (
                <div className="application-details">
                    <p><strong>Pet ID:</strong> {application.petId}</p>
                    <p><strong>Applicant Name:</strong> {application.name}</p>
                    <p><strong>Email:</strong> {application.email}</p>
                    <p><strong>City:</strong> {application.city}</p>
                    <p><strong>Mobile Number:</strong> {application.number}</p>

                    <div className="section-header">Personal Information</div>
                    <p><strong>Dob:</strong> {application.dob}</p>
                    <p><strong>Native Place:</strong> {application.nativePlace}</p>
                    <p><strong>Profession:</strong> {application.profession}</p>
                    <p><strong>Relationship:</strong> {application.relationship}</p>

                    <div className="section-header">Adoption Details</div>
                    <p><strong>Reason for Adoption:</strong> {application.reason}</p>
                    <p><strong>Space for Dog:</strong> {application.spaceForDog}</p>
                    <p><strong>Caregiver:</strong> {application.careGiver}</p>
                    <p><strong>Adoption Status:</strong> {application.status || "Pending"}</p>

                    <div className="section-header">Living Conditions</div>
                    <p><strong>Accommodation:</strong> {application.accommodation}</p>
                    <p><strong>Address:</strong> {application.address}</p>
                    <p><strong>Members At Home:</strong> {application.membersAtHome}</p>
                    <p><strong>Pets at Home:</strong> {application.pets}</p>

                    <div className="section-header">Pet Care</div>
                    <p><strong>Food Type:</strong> {application.foodType}</p>
                    <p><strong>Food Diet:</strong> {application.foodDiet}</p>
                    <p><strong>Dog Alone (Hours per day):</strong> {application.dogAlone}</p>
                    <p><strong>Walks per day (Hours):</strong> {application.walks}</p>

                    <NavLink to={`/adoption-request/${shelterId}`} className="back-button">
                        Back to Adoption Requests
                    </NavLink>
                </div>
            ) : (
                <p>No details found.</p>
            )}
        </div>
    );
}

export default ViewApplication;
