//Express
const express = require('express');
const router = express.Router({ mergeParams: true });

//Error Utils
const catchAsync = require('../utils/catchAsync')

//Controller
const reviews = require('../controllers/reviews');

//Middleware
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

//Methods
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;