let jwt = require('jsonwebtoken');
let User = require('../models/userModel');
let Event = require('../models/eventModel');

const JWT_SECRET = process.env.JWT_SECRET; 

let rsvpToEvent = async (req, res) => {
    let eventId = req.params.id;
    let token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
 
        const verified = jwt.verify(token, JWT_SECRET);
        const userId = verified.id; 
        
        let event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.RSVPs.includes(userId)) {
            return res.status(400).json({ message: 'User already RSVPed to this event' });
        }      
        if (event.RSVPs.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is full' });
        }
    
        event.RSVPs.push(userId);
        await event.save();
 
        let user = await Event.findById(userId);
        user.RSVPedEvents.push(eventId);
        await user.save();

        res.json({ message: 'RSVP successful', event });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

let viewRsvpStatus = async (req, res) => {
    let eventId = req.params.id;
    let token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
      
        const verified = jwt.verify(token, JWT_SECRET);
        const userId = verified.id;
  
        let event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const isRsvped = event.RSVPs.includes(userId);

        res.json({ isRsvped });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


let viewUserEvents = async (req, res) => {
    let token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
        
        const verified = jwt.verify(token, JWT_SECRET);
        const userId = verified.id;
        
        let user = await User.findById(userId).populate('RSVPedEvents');
        console.log(user)
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ events: user.RSVPedEvents });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    rsvpToEvent , 
    viewRsvpStatus ,
    viewUserEvents
}