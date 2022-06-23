const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../Utilities/catchAsync.js');
const isLoggedIn = require('../Utilities/isLoggedIn');
const { isReviewAuthor } = require('../Utilities/isAuthor');
const { validateReview } = require('../Utilities/validations');
const reviews = require('../controller/reviews');



router.post('/',isLoggedIn, validateReview, catchAsync(reviews.addReview))

router.delete('/:review_id', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview));


module.exports = router;