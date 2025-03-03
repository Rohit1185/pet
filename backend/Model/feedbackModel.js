const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    giverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    receiverId:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    giverRole: { type: String, enum: ["USER", "SHELTER"], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
