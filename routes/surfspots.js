//Express
const express = require('express');
const router = express.Router();

//Error Utils
const catchAsync = require('../utils/catchAsync')

//Clouds
const { storage } = require('../cloudinary');

//Multer
const multer = require('multer');
const upload = multer({ storage });

//Middleware
const { isLoggedIn, isAuthor, validateSpot } = require('../middleware');

//Controllers
const surfspots = require('../controllers/surfspots');

//Methods
router.route('/')
    .get(catchAsync(surfspots.index))
    .post(isLoggedIn, upload.array('image'), validateSpot, catchAsync(surfspots.addNewSpot));

router.get('/new', isLoggedIn, surfspots.renderNewForm);

router.route('/:id')
    .get(catchAsync(surfspots.showSpot))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateSpot, catchAsync(surfspots.updateSpot))
    .delete(isLoggedIn, isAuthor, catchAsync(surfspots.deleteSpot));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(surfspots.editSpot));

module.exports = router;