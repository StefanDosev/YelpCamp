const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const wrapAsync = require('../utils/wrapAsync');

const { isLoggedIn, validateCamground, isAuthor } = require('../middleware');




router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(validateCamground, isLoggedIn, wrapAsync(campgrounds.createCamp));


router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(wrapAsync(campgrounds.findCamp))
    .put(validateCamground, isLoggedIn, isAuthor, wrapAsync(campgrounds.submitEdit))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp))


router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, wrapAsync(campgrounds.editCamp))


module.exports = router;