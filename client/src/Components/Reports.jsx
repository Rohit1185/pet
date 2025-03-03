import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import userProfile from "../Context/userProfile";
import axios from "axios";
import "../assets/reportShelter.css";

function ReportShelter() {
    const navigate = useNavigate();
    const user = useContext(userProfile);
    const userId = user?.userdetails?.userId || ""; // ✅ Get logged-in user ID
    const userRole = user?.userdetails?.isShelter === "YES" ? "SHELTER" : "USER"; // ✅ Determine user role

    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [message, setMessage] = useState("");

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason || !details) {
            setMessage("⚠️ All fields are required.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/report-shelter", {
                userId, 
                userRole, // ✅ Send the user's role
                reason,
                details
            });

            if (response.data.success) {
                setMessage("✅ Report submitted successfully!");
                setReason("");
                setDetails("");

                // ✅ Navigate back after 3 seconds
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                setMessage("❌ Failed to submit the report.");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            setMessage("❌ Error submitting report.");
        }
    };

    return (
        <div className="report-container">
            <h2>Report a Shelter</h2>
            <form onSubmit={handleSubmit} className="report-form">
                <label>Reason:</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} required>
                    <option value="">Select Reason</option>
                    <option value="Animal Neglect">Animal Neglect</option>
                    <option value="Poor Conditions">Poor Conditions</option>
                    <option value="Rude Behavior">Rude Behavior</option>
                    <option value="Scam Alert">Scam Alert</option>
                    <option value="Other">Other</option>
                </select>

                <label>Details:</label>
                <textarea 
                    value={details} 
                    onChange={(e) => setDetails(e.target.value)} 
                    placeholder="Describe the issue..."
                    required
                ></textarea>

                <button type="submit">Submit Report</button>
                {message && <p className="response-message">{message}</p>}
            </form>
        </div>
    );
}

export default ReportShelter;
