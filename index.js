let express = require('express');
let app = express();
let PORT = process.env.PORT ||  5000 ;
const path = require('path');
let userRoute = require('./routes/userRoute');
let eventRoute = require('./routes/eventRoute');
let rsvpRoute = require('./routes/rsvpRoute')
let body_parser = require('body-parser');
let mongoose = require('./database/db');
let cookie_parser = require('cookie-parser');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie_parser());

app.use('/',userRoute);
app.use('/event' , eventRoute);
app.use('/rsvp' , rsvpRoute);

app.listen(PORT, (req,res) =>{
    console.log(`Server is running on port ${PORT}`);
})





