import  { useState } from "react";
import "../../assets/HealthGuide.css";

const HealthGuide = () => {
  const [selectedPet, setSelectedPet] = useState("dog");

  const handlePetChange = (e) => {
    setSelectedPet(e.target.value);
  };

  const vaccineInfo = {
    dog: {
      title: "Dog Vaccination Guide",
      vaccines: [
        {
          vaccine: "Rabies Vaccine",
          age: "6-8 weeks",
          description: "Prevents rabies, a fatal viral disease. It is legally required in many regions.",
          image: "https://images.pexels.com/photos/3267002/pexels-photo-3267002.jpeg", // Free image URL for rabies vaccine
        },
        {
          vaccine: "Distemper Vaccine",
          age: "6-8 weeks",
          description: "Protects against distemper, a contagious viral disease affecting the respiratory, gastrointestinal, and nervous systems.",
          image: "https://images.pexels.com/photos/3244539/pexels-photo-3244539.jpeg", // Free image URL for distemper vaccine
        },
        {
          vaccine: "Parvovirus Vaccine",
          age: "6-8 weeks",
          description: "Prevents parvovirus, a serious and deadly disease, especially in puppies.",
          image: "https://images.pexels.com/photos/4048460/pexels-photo-4048460.jpeg", // Free image URL for parvovirus vaccine
        },
        {
          vaccine: "Bordetella Vaccine",
          age: "6-8 weeks",
          description: "Helps protect against kennel cough, a highly contagious respiratory infection.",
          image: "https://images.pexels.com/photos/2651876/pexels-photo-2651876.jpeg", // Free image URL for bordetella vaccine
        },
        {
          vaccine: "Leptospirosis Vaccine",
          age: "12 weeks",
          description: "Prevents leptospirosis, a bacterial infection that can affect both animals and humans.",
          image: "https://images.pexels.com/photos/4126099/pexels-photo-4126099.jpeg", // Free image URL for leptospirosis vaccine
        },
      ],
    },
    cat: {
      title: "Cat Vaccination Guide",
      vaccines: [
        {
          vaccine: "Rabies Vaccine",
          age: "8 weeks",
          description: "Protects against the deadly rabies virus, preventing transmission to humans.",
          image: "https://images.pexels.com/photos/4126099/pexels-photo-4126099.jpeg", // Free image URL for rabies vaccine (Cat)
        },
        {
          vaccine: "Feline Leukemia Vaccine",
          age: "8-9 weeks",
          description: "Prevents feline leukemia, a viral disease that can cause cancer and immune system problems.",
          image: "https://images.pexels.com/photos/4048460/pexels-photo-4048460.jpeg", // Free image URL for feline leukemia vaccine
        },
        {
          vaccine: "Feline Distemper Vaccine",
          age: "8 weeks",
          description: "Protects against feline distemper virus, which affects the gastrointestinal and respiratory systems.",
          image: "https://images.pexels.com/photos/3267002/pexels-photo-3267002.jpeg", // Free image URL for feline distemper vaccine
        },
      ],
    },
    bird: {
      title: "Bird Vaccination Guide",
      vaccines: [
        {
          vaccine: "Avian Polyomavirus Vaccine",
          age: "6-8 weeks",
          description: "Prevents polyomavirus, which affects young birds, causing death in some cases.",
          image: "https://images.pexels.com/photos/3284942/pexels-photo-3284942.jpeg", // Free image URL for avian polyomavirus vaccine
        },
        {
          vaccine: "Psittacosis Vaccine",
          age: "6-8 weeks",
          description: "Prevents psittacosis, a respiratory disease that can be spread to humans.",
          image: "https://images.pexels.com/photos/1298416/pexels-photo-1298416.jpeg", // Free image URL for psittacosis vaccine
        },
      ],
    },
    rabbit: {
      title: "Rabbit Vaccination Guide",
      vaccines: [
        {
          vaccine: "Rabbit Hemorrhagic Disease Vaccine",
          age: "8-12 weeks",
          description: "Prevents rabbit hemorrhagic disease, a fatal illness.",
          image: "https://images.pexels.com/photos/1298369/pexels-photo-1298369.jpeg", // Free image URL for rabbit hemorrhagic disease vaccine
        },
        {
          vaccine: "Myxomatosis Vaccine",
          age: "8 weeks",
          description: "Protects rabbits from myxomatosis, a viral disease.",
          image: "https://images.pexels.com/photos/2652091/pexels-photo-2652091.jpeg", // Free image URL for myxomatosis vaccine
        },
      ],
    },
  };

  return (
    <div className="health-guide-container">
      <div className="select-pet">
        <h1>Select Pet to View Vaccination Guide</h1>
        <select onChange={handlePetChange} value={selectedPet}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
        </select>
      </div>

      <div className="vaccine-section">
        <h2>{vaccineInfo[selectedPet].title}</h2>
        {vaccineInfo[selectedPet].vaccines.map((vaccine, index) => (
          <div key={index} className="vaccine-item">
            <img src={vaccine.image} alt={`${vaccine.vaccine} image`} className="vaccine-image" />
            <div className="vaccine-details">
              <h3>{vaccine.vaccine}</h3>
              <p><strong>Age:</strong> {vaccine.age}</p>
              <p><strong>Description:</strong> {vaccine.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthGuide;
