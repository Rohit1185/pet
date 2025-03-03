import { useState, useContext } from "react";
import axios from "axios";
import userProfileData from "../context/userProfile";
import { useLocation } from "react-router-dom";
import "../assets/feedback.css";

const FeedbackForm = () => {
  const user = useContext(userProfileData);
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const userId = location.state?.userId;
  const shelterId = location.state?.shelterId;

  const submitFeedback = async () => {
    console.log(userId);
    if (!rating || !message.trim()) {
      setFeedbackMessage("⚠️ Please provide both rating and message.");
      return;
    }

    setLoading(true);
    setFeedbackMessage("");
    const data = {
      giverId: user.userdetails.userId,
      giverRole: user.userdetails.isShelter === "YES" ? "SHELTER" : "USER",
      receiverId: user.userdetails.isShelter === "YES" ? userId : shelterId,
      rating: parseInt(rating, 10),
      message,
    };

    try {
      console.log(data);
      const response = await axios.post("http://localhost:8080/submit-feedback", data);

      if (response.data.success) {
        setFeedbackMessage("✅ Feedback submitted successfully!");
        setRating("");
        setMessage("");
        setTimeout(() => setFeedbackMessage(""), 3000);
      } else {
        setFeedbackMessage("❌ Failed to submit feedback.");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error status code (e.g., 400, 500)
        console.error("Server Error:", error.response.data);
        setFeedbackMessage(`❌ ${error.response.data.message || "An error occurred. Please try again."}`);
      } else if (error.request) {
        // No response received (e.g., network error)
        console.error("Network Error:", error.request);
        setFeedbackMessage("❌ Network error. Please check your connection.");
      } else {
        // Something else happened
        console.error("Unexpected Error:", error.message);
        setFeedbackMessage(`❌ ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <h2>{user.userdetails.isShelter === "YES" ? "Rate a User" : "Rate a Shelter"}</h2>

      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="">Select Rating</option>
        <option value="1">⭐ - Poor</option>
        <option value="2">⭐⭐ - Fair</option>
        <option value="3">⭐⭐⭐ - Good</option>
        <option value="4">⭐⭐⭐⭐ - Very Good</option>
        <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
      </select>

      <label>Message:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your feedback..."
      />

      <button onClick={submitFeedback} disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>

      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
    </div>
  );
};

export default FeedbackForm;
