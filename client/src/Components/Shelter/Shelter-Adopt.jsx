import axios from "axios";
import "../../assets/shelter-adopt.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ShelterAdopt() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [search, setSearch] = useState({ name: "", breed: "", age: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 6;
  let navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        console.log("Fetching pets...");
        const response = await axios.get("http://localhost:8080/shelter-list-page");
        console.log(response.data)
        // Filter out adopted pets (status: 'accepted')
        const availablePets = response.data.filter(pet => pet.status !== "Accepted");

        setPets(availablePets);
        setFilteredPets(availablePets);
      } catch (e) {
        console.log("Error while fetching data", e);
      }
    };

    fetchPets();

    // Listen for adoption updates
    const handleAdoptionUpdate = () => fetchPets();
    window.addEventListener("adoptionUpdated", handleAdoptionUpdate);

    return () => {
      window.removeEventListener("adoptionUpdated", handleAdoptionUpdate);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // Perform search
  const handleSearch = () => {
    let filtered = pets.filter((pet) => {
      return (
        (search.name === "" || pet.petName.toLowerCase().includes(search.name.toLowerCase())) &&
        (search.breed === "" || pet.petBreed.toLowerCase().includes(search.breed.toLowerCase())) &&
        (search.age === "" || pet.petAge.toString() === search.age)
      );
    });
    setFilteredPets(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Pagination Logic
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to adoption form
  const navigateLink = (petId) => {
    navigate(`/adoptionform/${petId}`);
  };

  return (
    <>
      {/* 🔍 Search Form */}
      <div className="search-container">
        <h2>Find a Pet for Adoption</h2>
        <div className="search-form">
          <input type="text" name="name" placeholder="Search by Name" value={search.name} onChange={handleSearchChange} />
          <input type="text" name="breed" placeholder="Search by Breed" value={search.breed} onChange={handleSearchChange} />
          <input type="number" name="age" placeholder="Search by Age" value={search.age} onChange={handleSearchChange} />
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* 🐶 Pet Listings */}
      <div className="pet-main">
        {currentPets.length > 0 ? (
          currentPets.map((petdetails) => (
            <div className="pet-box" key={petdetails.petId}>
              <div className="pet-image-container">
                <img src={`http://localhost:8080/uploads/${petdetails.petPhoto}`} alt={petdetails.petName} />
              </div>
              <div className="adopt-details-pet">
                <h3>Name: {petdetails.petName}</h3>
                <h4>Breed: {petdetails.petBreed}</h4>
                <h4>Age: {petdetails.petAge}</h4>
                <h4>Reason: {petdetails.petReason}</h4>
                <h4>Settle Time: {petdetails.behaviour}</h4>
              </div>
              <input type="button" value="Adopt" onClick={() => navigateLink(petdetails.petId)} id="adopt-btn-form" />
            </div>
          ))
        ) : (
          <p className="no-results">No pets found. Try another search.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredPets.length > petsPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredPets.length / petsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default ShelterAdopt;
