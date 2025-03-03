const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventname: { type: String },
    place: { type: String },
    date: { type: Date },
    time: { type: String },
    maxlimit: { type: Number },
    category: { type: String },
    imgpath: { type: String },
    shelterName: { type: String },
    shelterContact: { type: String },
    ShelterId: { type: String,require:true },
    userId:{type:String}
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
