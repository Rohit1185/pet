import { useState } from "react";
import "../../assets/PetFood.css";

const PetFoodGuide = () => {
  const [selectedPet, setSelectedPet] = useState("dog");

  const handlePetChange = (e) => {
    setSelectedPet(e.target.value);
  };

  const foodInfo = {
    dog: {
      title: "Dog Food Guide",
      stages: [
        {
          stage: "Puppy (0-12 months)",
          details: [
            "High protein (22-32%) for muscle growth.",
            "Rich in calcium & phosphorus for strong bones.",
            "Soft, small kibble or wet food for easy digestion.",
            "Feed 3-4 times a day.",
            "Recommended: Royal Canin Puppy, Pedigree Puppy.",
          ],
        },
        {
          stage: "Adult Dog (1-7 years)",
          details: [
            "Balanced protein (18-25%) & fat (5-15%) for energy.",
            "Contains omega-3 & omega-6 for a shiny coat.",
            "Avoid excess grains & fillers.",
            "Feed 2 times a day.",
            "Recommended: Pedigree, Drools, Farmina N&D.",
          ],
        },
        {
          stage: "Senior Dog (7+ years)",
          details: [
            "Low calories & fat to prevent obesity.",
            "Glucosamine & chondroitin for joint health.",
            "Soft or moist food if teeth are weak.",
            "Feed 2 small meals a day.",
            "Recommended: Hill’s Science Diet Senior, Royal Canin Ageing.",
          ],
        },
      ],
      restrictedFoods: [
        "Chocolate",
        "Grapes & Raisins",
        "Onions & Garlic",
        "Spicy Food",
        "Dairy Products",
        "Raw Meat",
        "Alcohol",
      ],
    },
    cat: {
      title: "Cat Food Guide",
      stages: [
        {
          stage: "Kitten (0-12 months)",
          details: [
            "High protein for muscle development.",
            "Rich in taurine for healthy heart & eyes.",
            "Soft food or small kibble for easy eating.",
            "Feed 3-4 times a day.",
            "Recommended: Hill’s Science Diet Kitten, Royal Canin Kitten.",
          ],
        },
        {
          stage: "Adult Cat (1-7 years)",
          details: [
            "Moderate protein & fat for energy.",
            "Supports healthy digestion & coat.",
            "Feed 2 times a day.",
            "Recommended: Whiskas, Iams, Blue Buffalo.",
          ],
        },
        {
          stage: "Senior Cat (7+ years)",
          details: [
            "Reduced calories to manage weight.",
            "High-quality protein to maintain muscle mass.",
            "Soft food for easier chewing.",
            "Feed 2 small meals a day.",
            "Recommended: Hill’s Science Diet Senior, Royal Canin Ageing.",
          ],
        },
      ],
      restrictedFoods: [
        "Chocolate",
        "Onions & Garlic",
        "Dairy Products",
        "Raw Fish",
        "Alcohol",
      ],
    },
    bird: {
      title: "Bird Food Guide",
      stages: [
        {
          stage: "Seed Mix (All stages)",
          details: [
            "High in essential fats & fiber.",
            "Suitable for most pet birds like parrots, finches, and canaries.",
            "Feed 2 times a day.",
            "Recommended: Kaytee, Vitakraft.",
          ],
        },
        {
          stage: "Pellets (All stages)",
          details: [
            "Balanced nutrition with essential vitamins & minerals.",
            "Good for birds who tend to be picky eaters.",
            "Feed 2 times a day.",
            "Recommended: Zupreem, Lafeber.",
          ],
        },
      ],
      restrictedFoods: [
        "Chocolate",
        "Avocado",
        "Onions & Garlic",
        "Caffeine",
        "Alcohol",
      ],
    },
    rabbit: {
      title: "Rabbit Food Guide",
      stages: [
        {
          stage: "Hay (All stages)",
          details: [
            "Fresh, unlimited hay (Timothy, Meadow, etc.).",
            "High in fiber for healthy digestion.",
            "Hay should make up 75% of their diet.",
          ],
        },
        {
          stage: "Pellets (Adult & Senior)",
          details: [
            "Fiber-rich pellets to support digestion and dental health.",
            "Feed in moderation to prevent obesity.",
            "Recommended: Oxbow, Kaytee.",
          ],
        },
        {
          stage: "Fresh Veggies (All stages)",
          details: [
            "Dark leafy greens such as kale, parsley, cilantro.",
            "Limit high-calcium veggies like spinach.",
            "Feed 1-2 cups per 2 lbs of body weight per day.",
          ],
        },
      ],
      restrictedFoods: [
        "Iceberg Lettuce",
        "Potatoes",
        "Onions & Garlic",
        "Cabbage",
        "Fruit Seeds & Pits",
      ],
    },
  };

  return (
    <div className="pet-food-container">
      <h1>{foodInfo[selectedPet].title}</h1>

      {/* Pet Selector */}
      <div className="select-pet">
        <label htmlFor="pet-select">Select Your Pet: </label>
        <select id="pet-select" value={selectedPet} onChange={handlePetChange}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
        </select>
      </div>

      {/* Food Stages */}
      {foodInfo[selectedPet].stages.map((food, index) => (
        <div key={index} className="food-section">
          <h2>{food.stage}</h2>
          <ul>
            {food.details.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Restricted Foods */}
      <div className="restricted-section">
        <h2>⚠️ Foods to Avoid</h2>
        <ul>
          {foodInfo[selectedPet].restrictedFoods.map((food, index) => (
            <li key={index}>{food}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PetFoodGuide;
