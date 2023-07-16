const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/review');
const Campground = require('../models/campground');
const wrapAsync = require('../utils/wrapAsync');
const reviews = require('../controllers/reviews');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');




router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview))
router.delete('/:revId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;