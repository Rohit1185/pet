const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Auto-generate ObjectId for userId
        unique: true,
        index: true, // Optimized for queries
      },
    userFname: { type: String, required: true },
    userLname: { type: String },
    userEmail: { type: String, required: true ,match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    userContact: { type: String ,match: /^[0-9]{10}$/ },
    password: { type: String, required: true, minlength: 6 },
    isShelter: { type: String, enum: ['YES', 'NO'], required: true },
    shelterName: { type: String,trim: true,},
    shelterContact: { type: Number, trim: true },
    shelterAddress: { type: String, trim: true },
    userImg: { type: String },
    shelterId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Auto-generate ObjectId for userId
        unique: true,
        index: true, // Optimized for queries
      },
      resetPasswordToken: { type: String },  // Stores reset code
  resetPasswordExpires: { type: Date },
  status: { type: String, enum: ["Enabled", "Disabled"], default: "Enabled" }

}, { timestamps: true });


const User = mongoose.model('RegisterUser', userSchema);
module.exports = User;
