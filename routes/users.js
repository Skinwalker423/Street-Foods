const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require('../Utilities/catchAsync');
const passport = require('passport');
const users = require('../controller/users');

router.route('/register')
    .get(users.renderRegistrationForm)
    .post(catchAsync (users.registerNewUser));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;