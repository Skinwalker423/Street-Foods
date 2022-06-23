const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../Utilities/catchAsync.js')
const Review = require('../models/review');
const CampGround = require('../models/campground');
const ExpressError = require('../Utilities/ExpressError');
const isLoggedIn = require('../Utilities/isLoggedIn');
const {isAuthor} = require('../Utilities/isAuthor');
const {validateCampground} = require('../Utilities/validations');
const User = require('../models/user');
const campgrounds = require('../controller/campgrounds');
const multer = require('multer');
const {storage, cloudinary} = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createNewCampground));
    

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync (campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground)); 

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
