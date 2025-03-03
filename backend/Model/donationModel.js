const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  shelterName: { type: String, required: true },
  shelterContact: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
