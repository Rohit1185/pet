import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/adoption.css';
import { useContext } from 'react';
import userProfile from '../Context/userProfile'
import axios from 'axios';
function AdoptionForm() {
    let navigate = useNavigate();
    let user = useContext(userProfile);
    const { petId } = useParams(); // Get petId from the URL
    const [pet, setPet] = useState(null);
    console.log("user id",user.userdetails.userId)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        city: '',
        dob: '',
        address: '',
        nativePlace: '',
        reason: '',
        relationship: '',
        foodType: '',
        foodDiet: '',
        careGiver: '',
        membersAtHome: '',
        profession: '',
        dogAlone: '',
        walks: '',
        spaceForDog: '',
        tieTime: '',
        accommodation: '',
        pets: '',
        appointment: '',
        questions: '',
        status:'Pending'
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/shelter-list-page/${petId}`);
                setPet(response.data);
            } catch (error) {
                console.error("Error fetching pet details:", error);
            }
        };
        fetchPetDetails();
    }, [petId]);

    if (!pet) return <h2>Loading...</h2>;

    // Handle input changes
    const handleInputChange = (e) => {

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Validate form data
    const validateForm = () => {
        const errors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key] && key !== 'questions') { // Skip questions field
                errors[key] = 'This field is required';
            }
        });
        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure pet data has been loaded
        if (!pet) {
            console.error("Pet data is not loaded yet");
            return;
        }
    
        console.log("Form Start here");
    
        const errors = validateForm();
        setFormErrors(errors);
    
        // Check if userIdInput matches pet's userId and petId matches the UR
    
        console.log("Form updating UserId");
    
        // Include userId and petId in formData
        const updatedFormData = {
            ...formData,
            userId: user.userdetails.userId,  // Add the user ID to the formData
            petId: pet.petId,
            shelterId:pet.shelterId     // Use the petId from the pet object (after it is fetched)
        };
        console.log("Sending data to API", updatedFormData);
    
        if (Object.keys(errors).length === 0) {
            console.log("No validation errors. Proceeding to submit...");
            try {
                // Log before sending the request
                console.log("Sending adoption form data...");
                await axios.post('http://localhost:8080/submit-adoption-form', updatedFormData);
                alert('Adoption Application Submitted!');
                navigate('/',setTimeout(1000))
                
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        } else {
            console.log("Form validation errors:", errors);
        }
    };
    
    
    return (
        <>
            <div className="pet-details-container">
                <h2>Pet Details</h2>
                <div className='pet-details-container-info'>
                <div className='pet-details-container-info-img'>
                <img src={`http://localhost:8080/uploads/${pet.petPhoto}`} alt={pet.petName} />
                </div>
                <div className='pet-details-container-info-text'>
                <h3>Name: {pet.petName}</h3>
                <h4>Breed: {pet.petBreed}</h4>
                <h4>Age: {pet.petAge}</h4>
                <h4>Reason: {pet.petReason}</h4>
                <h4>Settle Time: {pet.behaviour}</h4>
                <h4>Vaccine: {pet.vaccines+","}</h4>
                </div>
                </div>
            </div>

            <form className="adoption-form-container" onSubmit={handleSubmit}>
                <h2>Adoption Application Form</h2>
                <div className="form-group">
                    <label htmlFor="userId">Your User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={user.userdetails.userId}
                    
                        disabled
            />
                </div>

                {/* Pet ID Input */}
                <div className="form-group">
                    <label htmlFor="petId">Pet ID:</label>
                    <input
                        type="text"
                        id="petId"
                        name="petId"
                        value={petId}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shelterId">Shelter ID:</label>
                    <input
                        type="text"
                        id="shelterId"
                        name="shelterId"
                        value={pet.shelterId}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Your Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.name && <span className="error">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.email && <span className="error">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="number">Phone Number:</label>
                    <input
                        type="tel"
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.number && <span className="error">{formErrors.number}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="city">Current City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.city && <span className="error">{formErrors.city}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="dob">Date of Birth:</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.dob && <span className="error">{formErrors.dob}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea
                        id="address"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.address && <span className="error">{formErrors.address}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="nativePlace">Native Place:</label>
                    <input
                        type="text"
                        id="nativePlace"
                        name="nativePlace"
                        value={formData.nativePlace}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.nativePlace && <span className="error">{formErrors.nativePlace}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="reason">Why are you looking to adopt?</label>
                    <textarea
                        id="reason"
                        name="reason"
                        rows="3"
                        value={formData.reason}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.reason && <span className="error">{formErrors.reason}</span>}
                </div>

                <div className="form-group">
                    <label>Are you single or with family?</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="relationship"
                                value="single"
                                onChange={handleInputChange}
                                required
                            /> Yes, I am single
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="relationship"
                                value="family"
                                onChange={handleInputChange}
                                required
                            /> With family
                        </label>
                    </div>
                    {formErrors.relationship && <span className="error">{formErrors.relationship}</span>}
                </div>

                

                <div className="form-group">
                    <label>What will you feed the dog?</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="foodType"
                                value="veg"
                                onChange={handleInputChange}
                                required
                            /> Veg
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="foodType"
                                value="nonVeg"
                                onChange={handleInputChange}
                                required
                            /> Non Veg
                        </label>
                    </div>
                    {formErrors.foodType && <span className="error">{formErrors.foodType}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="foodDiet">Specify the food diet:</label>
                    <textarea
                        id="foodDiet"
                        name="foodDiet"
                        rows="3"
                        value={formData.foodDiet}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.foodDiet && <span className="error">{formErrors.foodDiet}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="careGiver">Who will be the primary care giver?</label>
                    <input
                        type="text"
                        id="careGiver"
                        name="careGiver"
                        value={formData.careGiver}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.careGiver && <span className="error">{formErrors.careGiver}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="membersAtHome">How many members are at home?</label>
                    <input
                        type="number"
                        id="membersAtHome"
                        name="membersAtHome"
                        value={formData.membersAtHome}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.membersAtHome && <span className="error">{formErrors.membersAtHome}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="profession">What is your profession and work timing?</label>
                    <textarea
                        id="profession"
                        name="profession"
                        rows="3"
                        value={formData.profession}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.profession && <span className="error">{formErrors.profession}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="dogAlone">How many hours will the dog be expected to be alone on any day?</label>
                    <input
                        type="number"
                        id="dogAlone"
                        name="dogAlone"
                        value={formData.dogAlone}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.dogAlone && <span className="error">{formErrors.dogAlone}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="walks">How many times will you walk the dog in a day?</label>
                    <input
                        type="number"
                        id="walks"
                        name="walks"
                        value={formData.walks}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.walks && <span className="error">{formErrors.walks}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="spaceForDog">Is there any open space for the dog to run around in your house or outside?</label>
                    <textarea
                        id="spaceForDog"
                        name="spaceForDog"
                        rows="3"
                        value={formData.spaceForDog}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.spaceForDog && <span className="error">{formErrors.spaceForDog}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="tieTime">When will you tie the dog?</label>
                    <input
                        type="text"
                        id="tieTime"
                        name="tieTime"
                        value={formData.tieTime}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.tieTime && <span className="error">{formErrors.tieTime}</span>}
                </div>

                <div className="form-group">
                    <label>Accommodation Type:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="accommodation"
                                value="independentHouse"
                                onChange={handleInputChange}
                                required
                            /> Independent House
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="accommodation"
                                value="apartment"
                                onChange={handleInputChange}
                                required
                            /> Apartment
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="accommodation"
                                value="farmHouse"
                                onChange={handleInputChange}
                                required
                            /> Farm House
                        </label>
                    </div>
                    {formErrors.accommodation && <span className="error">{formErrors.accommodation}</span>}
                </div>

                

                <div className="form-group">
                    <label>Do you have any pets at home?</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="pets"
                                value="yes"
                                onChange={handleInputChange}
                                required
                            /> Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="pets"
                                value="no"
                                onChange={handleInputChange}
                                required
                            /> No
                        </label>
                    </div>
                    {formErrors.pets && <span className="error">{formErrors.pets}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="appointment">When can you come to meet the pet?</label>
                    <input
                        type="date"
                        id="appointment"
                        name="appointment"
                        value={formData.appointment}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.appointment && <span className="error">{formErrors.appointment}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="questions">Do you have any questions for us?</label>
                    <textarea
                        id="questions"
                        name="questions"
                        rows="3"
                        value={formData.questions}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" >Submit Application</button>
            </form>
        </>
    );
}

export default AdoptionForm;
