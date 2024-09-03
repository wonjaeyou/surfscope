//Express
const express = require('express');
const router = express.Router();

//Passport
const passport = require('passport');

//Models
const User = require('../models/user');

//Error Utils
const catchAsync = require('../utils/catchAsync');

//Controller
const users = require('../controllers/users')

//Middleware
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;