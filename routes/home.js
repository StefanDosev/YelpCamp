const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const { getHome } = require('../controllers/home');

// Define the home route
router.get('/', wrapAsync(getHome));

module.exports = router;