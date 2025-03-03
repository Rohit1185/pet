import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileSidebar from '../../Components/Profilesidebar';
import axios from "axios";
import "../../assets/viewfeedback.css";

function ViewShelterFeedback() {
    const { shelterId } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]); // For Filtering
    const [averageRating, setAverageRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterRating, setFilterRating] = useState("All"); // Rating Filter
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5; // ✅ Show 5 feedbacks per page

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/submit-feedback/${shelterId}`);
                console.log(response.data)
                if (response.data.success) {
                    setFeedbacks(response.data.feedbacks);
                    setFilteredFeedbacks(response.data.feedbacks);
                    setAverageRating(response.data.averageRating);
                } else {
                    setError("No feedback found.");
                }
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Failed to load feedback.");
            } finally {
                setLoading(false);
            }
        };

        if (shelterId) fetchFeedbacks();
    }, [shelterId]);

    // ✅ Filter feedbacks based on selected rating
    const handleFilterChange = (e) => {
        const selectedRating = e.target.value;
        setFilterRating(selectedRating);

        if (selectedRating === "All") {
            setFilteredFeedbacks(feedbacks);
        } else {
            setFilteredFeedbacks(feedbacks.filter(fb => fb.rating === parseInt(selectedRating)));
        }

        setCurrentPage(1); // Reset to first page when filter changes
    };

    // ✅ Pagination Logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredFeedbacks.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredFeedbacks.length / recordsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="feedback-container">
            <div className="profile-sidebar">
                <ProfileSidebar/>
            </div>
            <div className="feedback-info">
                <h2>Shelter Feedback</h2>

                {/* 📌 Average Rating */}
                {averageRating && (
                    <div className="average-rating">
                        <p>⭐ Average Rating: {averageRating} / 5</p>
                    </div>
                )}

                {/* 📌 Rating Filter */}
                <div className="filter-container">
                    <label htmlFor="ratingFilter">Filter by Rating:</label>
                    <select id="ratingFilter" value={filterRating} onChange={handleFilterChange}>
                        <option value="All">All</option>
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                        <option value="2">⭐⭐ (2 Stars)</option>
                        <option value="1">⭐ (1 Star)</option>
                    </select>
                </div>

                {/* 📌 Feedback List */}
                <div className="feedback-list">
                    <h3>User Reviews</h3>
                    {loading && <p>Loading feedback...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {currentRecords.length > 0 ? (
                        currentRecords.map((fb, index) => (
                            <div key={index} className="feedback-item">
                                <p className="feedback-rating">⭐ {fb.rating} / 5</p>
                                <p className="feedback-comment">&quot;{fb.message}&#34;</p>
                
                            </div>
                        ))
                    ) : (
                        !loading && <p>No feedback available.</p>
                    )}
                </div>

                {/* 📌 Pagination Controls */}
                {filteredFeedbacks.length > recordsPerPage && (
                    <div className="pagination">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewShelterFeedback;
