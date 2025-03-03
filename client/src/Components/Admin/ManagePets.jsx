import "../../assets/ManagePets.css";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function ManagePets() {
  const [pets, setPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search Query
  const [currentPage, setCurrentPage] = useState(1); // ✅ Pagination State
  const petsPerPage = 5; // ✅ Show 5 pets per page

  const [editingPetId, setEditingPetId] = useState(null);
  const [editablePet, setEditablePet] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:8080/shelter-list-page");
        console.log(response.data)
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
        alert("Failed to fetch pets.");
      }
    };

    fetchPets();
  }, []);

  // ✅ Delete Pet
  const deletePet = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await axios.delete(`http://localhost:8080/shelter-list-page/${petId}`);
        setPets(pets.filter(pet => pet.petId !== petId));
        alert("Pet deleted successfully!");
      } catch (error) {
        console.error("Error deleting pet:", error);
        alert("Failed to delete pet.");
      }
    }
  };

  // ✅ Enable Editing Mode
  const startEditing = (pet) => {
    setEditingPetId(pet.petId);
    setEditablePet({ ...pet });
  };

  // ✅ Handle Input Changes
  const handleChange = (e, field) => {
    setEditablePet({ ...editablePet, [field]: e.target.value });
  };

  // ✅ Save Updated Pet
  const savePet = async () => {
    try {
      await axios.put(`http://localhost:8080/shelter-list-page/${editablePet.petId}`, editablePet);
      setPets(pets.map(pet => (pet.petId === editablePet.petId ? editablePet : pet)));
      alert("Pet updated successfully!");
      setEditingPetId(null);
      setEditablePet(null);
    } catch (error) {
      console.error("Error updating pet:", error);
      alert("Failed to update pet.");
    }
  };

  // ✅ Filter Pets Based on Search Query
  const filteredPets = pets.filter(pet =>
    pet.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.petBreed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.shelterId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  return (
    <div id="manage-section">
      <div className="manage-header">
        <h2 id="manage-title">🐾 Manage Pets</h2>
        <input
          type="text"
          placeholder="Search Pets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table id="admin-table">
        <thead>
          <tr>
          
            <th>Pet ID</th>
            <th>Name</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Shelter Name</th>
            <th>Registered Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPets.map(pet => (
            <tr key={pet._id}>
              
              <td>{pet.petId}</td>
              <td>
                {editingPetId === pet.petId ? (
                  <input type="text" value={editablePet.petName} onChange={(e) => handleChange(e, "petName")} />
                ) : (
                  pet.petName
                )}
              </td>
              <td>
                {editingPetId === pet.petId ? (
                  <input type="text" value={editablePet.petBreed} onChange={(e) => handleChange(e, "petBreed")} />
                ) : (
                  pet.petBreed
                )}
              </td>
              <td>{pet.petAge}</td>
              <td>{pet.shelterName}</td>
              <td>{moment(pet.createdAt).format("DD-MM-YYYY")}</td>
              <td>{pet.adoptionStatus}</td>
              <td>
                {editingPetId === pet.petId ? (
                  <>
                    <button id="save-btn" onClick={savePet}>Save</button>
                    <button id="cancel-btn" onClick={() => setEditingPetId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button id="update-btn" onClick={() => startEditing(pet)}>Update</button>
                    <button id="delete-btn" onClick={() => deletePet(pet.petId)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination Buttons */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
