const Review = require('../models/review');
const CampGround = require('../models/campground');



module.exports.addReview = async(req, res, next) => {
    const { id } = req.params;
    const review = req.body.review;
    const user = req.user._id;
    const foundCamp = await CampGround.findById(id);
    console.log(user);
    const addedReview = await new Review(review);
    addedReview.username = user;
    foundCamp.reviews.push(addedReview);
    await addedReview.save();
    await foundCamp.save();
    req.flash('success', 'Successfully added a review!');
    res.redirect(`/campgrounds/${foundCamp._id}`);

}

module.exports.destroyReview = async(req, res, next) => {
    const { id, review_id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { $pull: {reviews: review_id}});
    const review = await Review.findByIdAndDelete(review_id);
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/campgrounds/${campground._id}`);

}



