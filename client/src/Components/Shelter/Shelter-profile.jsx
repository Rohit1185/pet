import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShelterReviews from "../Feedback"; // Import ShelterReviews Component

function ShelterProfile() {
    const { shelterId } = useParams(); // Get shelterId from URL
    const [shelter, setShelter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShelterData = async () => {
            try {
                console.log("Shelter id into frontend",shelterId)
                const response = await axios.get(`http://localhost:8080/registerusers/${shelterId}`);
                setShelter(response.data);
            } catch (err) {
                setError("Failed to load shelter details.",err);
            } finally {
                setLoading(false);
            }
        };

        fetchShelterData();
    }, [shelterId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="shelter-profile">
            <h2>{shelter.shelterName}</h2>
            <p>Location: {shelter.shelterAddress}</p>
            <p>Contact: {shelter.shelterId}</p>

            {/* Display Ratings & Feedback */}
            <ShelterReviews shelterId={shelterId} />
        </div>
    );
}

export default ShelterProfile;
