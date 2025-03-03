/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Profilesidebar from '../Components/Profilesidebar';
import '../assets/mypets.css';

function Mypet() {
  const { userId } = useParams();

  console.log("User ID from URL:", userId);

  const [mypets, setmyPet] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchmypet();
  }, [userId]);

  const fetchmypet = async () => {
    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }
    console.log("Fetching pets for user ID", userId);
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/my-pets/${userId}`);

      if (Array.isArray(response.data.pets)) {  
        setmyPet(response.data.pets);
      } else {
        setmyPet([]);  
      }
    } catch (e) {
      setError("Error fetching pet data.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Function to delete pet
  const handleDeletePet = async (petId) => {
    try {
      await axios.delete(`http://localhost:8080/delete-pet/${petId}`);
      setmyPet(mypets.filter(pet => pet._id !== petId)); // 🔄 Update UI after deletion
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("Failed to delete pet. Please try again.");
    }
  };

  return (
    <>

      <div className="pet">
        <div className="profile-sidebar">
          <Profilesidebar />
        </div>
        <div className="pet-details">
          {loading && <p>Loading your pets...</p>}
          {error && <p>{error}</p>}
          {mypets.length === 0 && !loading && !error && <p>No pets available.</p>}

          <table>
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Pet Breed</th>
                <th>Pet Age</th>
                <th>Pet Reason</th>
                <th>Pet Behaviour</th>
                <th>Image</th>
                <th>Action</th> {/* New Column for Delete Button */}
              </tr>
            </thead>
            <tbody>
              {mypets.map((pet, index) => (
                <tr key={index}>
                  <td>{pet.petName}</td>
                  <td>{pet.petBreed}</td>
                  <td>{pet.petAge}</td>
                  <td>{pet.petReason}</td>
                  <td>{pet.behaviour}</td>
                  <td>
                    <img
                      src={`http://localhost:8080/uploads/${pet.petPhoto}`}
                      alt={pet.petName}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeletePet(pet._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Mypet;
