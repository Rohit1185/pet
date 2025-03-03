const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser", // Reference to users
        required: true
    },
    shelterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser", // Reference to shelters
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: ["Animal Neglect", "Poor Conditions", "Rude Behavior", "Scam Alert", "Other"]
    },
    details: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    solution: {
        type: String,
        default: null // ✅ Solution added when resolved
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userRole: { type: String, enum: ["USER", "SHELTER"], required: true },

});

module.exports = mongoose.model("Report", ReportSchema);
