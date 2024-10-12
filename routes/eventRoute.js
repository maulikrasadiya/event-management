let express = require('express');
let route = express();
let controller = require('../controllers/eventController')
let upload = require('../middlewire/multer')

route.post('/' , upload.single('image'), controller.eventadd )
route.get('/', controller.getevent)
route.patch('/:id' ,upload.single('image'), controller.updateevent)
route.delete('/:id',controller.deleteevent)
route.get('/allevents' , controller.allevent)

module.exports = route