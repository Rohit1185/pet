const mongoose = require('mongoose');

const EventParticipationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to registered user
        required: true
    },
    shelterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registerusers', // Reference to the event-hosting shelter
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events', // Reference to the event
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EventParticipation', EventParticipationSchema);
