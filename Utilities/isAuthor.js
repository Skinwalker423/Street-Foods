const CampGround = require('../models/campground');
const Review = require('../models/review');

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    try{
    if(!req.user){
        req.flash('error', 'You are not authorized');
        console.log('an anon trying to modify a campground')
        return res.redirect(`/campgrounds/${id}`);
    }
    const campground = await CampGround.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized');
        console.log(`${req.user.username} is trying to modify a campground`);
        return res.redirect(`/campgrounds/${id}`);
    } 

    next();
    
    }catch(err){
        console.log('woops', err);
    }
    
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, review_id } = req.params;

    try{
    if(!req.user){
        req.flash('error', 'You are not authorized');
        console.log('an anon trying to modify a review')
        return res.redirect(`/campgrounds/${id}`);
    }
    const review = await Review.findById(review_id);
    if(!review.username._id.equals(req.user._id)) {
        req.flash('error', 'You are not authorized');
        console.log(`${req.user.username} is trying to modify a review`);
        return res.redirect(`/campgrounds/${id}`);
        
    }

    next();

    }catch(err){
        console.log('woops', err);
    }
    
}
