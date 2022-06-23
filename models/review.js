const mongoose = require('mongoose');
const {Schema} = mongoose;
const User = require('../models/user');

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true,
        maxlength: 255,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    username: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }
    
})



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;