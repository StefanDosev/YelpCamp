const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const passport = require('passport');
const users = require('../controllers/users')

const { storeReturnTo } = require('../middleware');


router.route('/register')
    .get(users.registerUser )
    .post(wrapAsync(users.renderRegister))

router.route('/login')
    .get(users.loginUser)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.renderLogin)


router.get('/logout',users.logoutUser); 


module.exports = router;

