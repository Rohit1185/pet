const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
    petId: { type: String }, // Reference to Pet collection
    userId: { type: String }, // Reference to User collection
    shelterId:{type:String},
    name: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    city: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    nativePlace: { type: String, required: true },
    reason: { type: String, required: true },
    relationship: { type: String, required: true },
    foodType: { type: String, required: true },
    foodDiet: { type: String, required: true },
    careGiver: { type: String, required: true },
    membersAtHome: { type: Number, required: true },
    profession: { type: String, required: true },
    dogAlone: { type: Number, required: true },
    walks: { type: Number, required: true },
    spaceForDog: { type: String, required: true },
    tieTime: { type: String, required: true },
    accommodation: { type: String, required: true },
    pets: { type: String, required: true },
    appointment: { type: Date, required: true },
    questions: { type: String },
    status: { type: String, default: "Pending" } // Default status set to "Pending"
}, { timestamps: true });

const Adoption = mongoose.model('AdoptionRequest', adoptionSchema);

module.exports = Adoption;
