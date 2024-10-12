let mongoose = require("mongoose");

let EventSchema = mongoose.Schema({
    etitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= new Date(); 
            },
            message: 'Event date must be in the future.'
        }
    },
    location: { 
        type: String,
        required: true
    },
    maxAttendees: { 
        type: Number,
        required: true
    },
    RSVPs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    author: {
        type: String,
        required: true
    },
    authid: {
        type: String,
        required: true
    },
    image: { 
        type: String,
        required: false 
    }
}, { timestamps: true });

let Event = mongoose.model('Event', EventSchema);

module.exports = Event;
