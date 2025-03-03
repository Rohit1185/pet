const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");
let petSchema = new mongoose.Schema({
    petId:{type: String,
        default: uuidv4, // Generate a UUID when a pet is created
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "registerusers", // Reference to Register Users
        required: true,
    },
    shelterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "registerusers", // Reference to Shelter Users
        default: null,
      },
    petName:{type:String},
    petBreed:{type:String},
    petAge:{type:Number},
    petPhoto:{type:String},
    petReason:{type:String},
    behaviour:{type:String},
    vaccines: { type: [String], required: true }, // Array of vaccines
})
const petList = mongoose.model("Pet List",petSchema);
module.exports = petList;