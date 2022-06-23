const { reviewSchema, campgroundSchema } = require('../schemas.js');
const ExpressError = require('../Utilities/ExpressError');

module.exports.validateCampground = (req, res, next) => {
    
        const { error } = campgroundSchema.validate(req.body);

        if(error) {
            console.log(error);
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
}
module.exports.validateReview = (req, res, next) => {
    
        const { error } = reviewSchema.validate(req.body);

        if(error) {
            console.log(error);
            const msg = error.details.map(err => err.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
}
