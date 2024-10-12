let User = require('../models/userModel')
let Event = require('../models/eventModel')
let cloudinary = require('../middlewire/cloudinary')
let jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

let eventadd = async (req, res) => {
    
    let token = req.cookies.token; 

    if (!token) {return res.status(401).json({ message: 'Access denied. Token missing.' });}

    try {
       
        const verified = jwt.verify(token, JWT_SECRET);
        const user = { id: verified.id, name: verified.name }; 

        const { etitle, description, date, location, maxAttendees } = req.body;
        console.log(req.body , "its our event add data")
        const image = req.file ? req.file.path : null; 
       
        if (!maxAttendees || maxAttendees <= 0) {
            return res.status(400).json({ message: 'Maximum attendees must be a positive number' });
        }

        const newEvent = new Event({
            etitle,
            description,
            date,
            location,
            maxAttendees: parseInt(maxAttendees),
            author: user.name,
            authid: user.id,   
            image: image     
        });

        
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

let getevent = async (req, res) => {
    let token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
        
        const verified = jwt.verify(token, JWT_SECRET);
        const userId = verified.id; 

        let events = await Event.find({ authid: userId });

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this user" });
        }

        res.json({ events });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

let updateevent = async (req, res) => {
    let eventId = req.params.id; 
    let updates = req.body;

    let token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
        const verified = jwt.verify(token,JWT_SECRET);
        const userId = verified.id;

        let existingEvent = await Event.findOne({ _id: eventId, authid: userId });

        if (!existingEvent) {
            return res.status(404).json({ message: "Event not found or you do not have permission to update this event" });
        }

        if (req.file) {
            if (existingEvent.image) {
                const publicId = existingEvent.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId); 
            }

            updates.image = req.file.path; 
        } else {
            updates.image = existingEvent.image;
        }

        let updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
            new: true,
            runValidators: true
        });

        res.json({ message: "Event updated successfully", event: updatedEvent });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

let deleteevent = async (req, res) => {
    let eventId = req.params.id; 

    let token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
       
        const verified = jwt.verify(token, JWT_SECRET);
        const userId = verified.id; 
        
        let deletedEvent = await Event.findOneAndDelete({ _id: eventId, authid: userId });
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found or you do not have permission to delete this event" });
        }

        const publicId = deletedEvent.image.split('/').pop().split('.')[0]; 
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

        res.json({ message: "Event deleted successfully", event: deletedEvent });
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

let allevent = async (req, res) => {
    let token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
        
        const verified = jwt.verify(token, JWT_SECRET);
        const userId = verified.id; 

       
        let userEvents = await Event.find();

        if (userEvents.length === 0) {
            return res.status(404).json({ message: "No events found for this user." });
        }

        
        res.status(200).json({ events: userEvents });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    eventadd , getevent , updateevent , deleteevent , allevent
};
