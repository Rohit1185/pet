import '../../assets/newlistpet.css';
import axios from 'axios';
import { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid'; // Generate unique pet IDs
import {v4 as uuidv4} from 'uuid'
import { useContext } from 'react';
import userProfile from '../../Context/userProfile';

function ShelterListPet() {
  let user = useContext(userProfile)

  // Form State
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petPhoto, setPetPhoto] = useState(null);
  const [petReason, setPetReason] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [errors, setErrors] = useState({});

  // Vaccine List for Different Pet Types
  const vaccineOptions = {
    Dog: ["Puppy DP", "DHPPiL", "Canine Corona", "Anti Rabies", "Kennel Cough"],
    Cat: ["Feline Rabies", "FVRCP", "Feline Leukemia", "Chlamydia", "Bordetella"],
    Bird: ["Avian Influenza", "Polyomavirus", "Pacheco's Disease", "Newcastle Disease"],
    Rabbit: ["Myxomatosis", "Rabbit Hemorrhagic Disease", "Pasteurella", "Calicivirus"]
  };

  // Handle Pet Breed Change & Update Vaccine List
  const handlePetChange = (e) => {
    setPetBreed(e.target.value);
    if (vaccineOptions[e.target.value]) {
      setAvailableVaccines(vaccineOptions[e.target.value]);
      setSelectedVaccines([]); // Reset vaccine selection
    }
  };

  // Handle Vaccine Selection
  const handleVaccineChange = (vaccine) => {
    setSelectedVaccines((prev) =>
      prev.includes(vaccine) ? prev.filter((v) => v !== vaccine) : [...prev, vaccine]
    );
  };

  // Form Validation
  const validateForm = () => {
    let formErrors = {};

    if (!petName.trim()) formErrors.petName = "Pet name is required.";
    if (!petBreed) formErrors.petBreed = "Please select a pet breed.";
    if (!petAge || petAge <= 0) formErrors.petAge = "Enter a valid pet age.";
    if (!petPhoto) formErrors.petPhoto = "Please upload a pet photo.";
    if (!petReason) formErrors.petReason = "Please select a reason for rehoming.";
    if (!behaviour) formErrors.behaviour = "Select how long you can keep the pet.";
    if (selectedVaccines.length === 0) formErrors.vaccines = "Select at least one vaccine.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Submit Form
  const addPet = async () => {
    console.log(user.userdetails.shelterId)
    if (!validateForm()) {
      console.log("Validation failed. Fix the errors before submitting.");
      return;
    }
    const petData = new FormData();
    petData.append("petId", uuidv4()); // Generate unique pet ID
    petData.append("userId", user.userdetails.userId); // Fetch from logged-in user
    petData.append("shelterId", user.userdetails.isShelter === "YES" ? user.userdetails.shelterId : ""); // Assign shelterId if user is a shelter
    petData.append("petName", petName);
    petData.append("petBreed", petBreed);
    petData.append("petAge", petAge);
    petData.append("petPhoto", petPhoto);
    petData.append("petReason", petReason);
    petData.append("behaviour", behaviour);
    petData.append("vaccines", JSON.stringify(selectedVaccines));

    try {
      const response = await axios.post('http://localhost:8080/shelter-list-page', petData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert("Pet successfully added!");
        // Reset form fields
        setPetName("");
        setPetBreed("");
        setPetAge("");
        setPetPhoto(null);
        setPetReason("");
        setBehaviour("");
        setSelectedVaccines([]);
      } else {
        alert("Failed to add pet. Please try again.");
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      alert(error.response?.data?.message || "Error occurred while adding the pet.");
    }
  };

  return (
    <>
      <h1>List Your Pet for Adoption</h1>
      <div className="list-pet-form">
        <form onSubmit={(e) => e.preventDefault()}>

          <label>Enter Your Pet Name</label>
          <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} />
          {errors.petName && <p className="error">{errors.petName}</p>}

          <label>Select Pet Breed</label>
          <select value={petBreed} onChange={handlePetChange}>
            <option value="">Select</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
          </select>
          {errors.petBreed && <p className="error">{errors.petBreed}</p>}

          <label>Upload Your Pet Photo</label>
          <input type="file" onChange={(e) => setPetPhoto(e.target.files[0])} />
          {errors.petPhoto && <p className="error">{errors.petPhoto}</p>}

          <label>Enter Your Pet Age</label>
          <input type="number" value={petAge} onChange={(e) => setPetAge(e.target.value)} />
          {errors.petAge && <p className="error">{errors.petAge}</p>}

          <label>Reason for Rehoming</label>
          <select value={petReason} onChange={(e) => setPetReason(e.target.value)}>
            <option value="">----Select----</option>
            <option value="Behavioral Issue">Behavioral Issue</option>
            <option value="Busy Schedule">Busy Schedule</option>
            <option value="Change in Family Circumstances">Change in Family Circumstances</option>
          </select>
          {errors.petReason && <p className="error">{errors.petReason}</p>}

          <label>Vaccinations Received</label>
          <div className='checkbox'>
            {availableVaccines.map((vaccine) => (
              <div key={vaccine} className='checkbox-value'>
                <input
                  type="checkbox"
                  value={vaccine}
                  checked={selectedVaccines.includes(vaccine)}
                  onChange={() => handleVaccineChange(vaccine)}
                />
                {vaccine}
              </div>
            ))}
          </div>
          {errors.vaccines && <p className="error">{errors.vaccines}</p>}

          <label>How long can you keep your pet while we find a home?</label>
          <select value={behaviour} onChange={(e) => setBehaviour(e.target.value)}>
            <option value="">Select</option>
            <option value="Less than 1 Month">Less than 1 Month</option>
            <option value="1 Month">1 Month</option>
            <option value="2 Months">2 Months</option>
            <option value="Until Home Found">Until Home Found</option>
          </select>
          {errors.behaviour && <p className="error">{errors.behaviour}</p>}

          <input type="button" value="List your Pet" onClick={addPet} className="submit-btn" />
        </form>
      </div>
    </>
  );
}

export default ShelterListPet;
