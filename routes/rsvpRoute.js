let express = require('express');
let route = express();
let controller = require('../controllers/rsvpController');

route.post('/rsvp/:id', controller.rsvpToEvent);
route.get('/rsvp/:id', controller.viewRsvpStatus);
route.get('/user/events', controller.viewUserEvents);

module.exports = route;
