const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review');

const CampGroundsSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [{
        url: String,
        filename: String
    }],
    reviews: [{
        type: Schema.Types.ObjectId, 
        ref: 'Review'
    }],
    author: {type: Schema.Types.ObjectId, ref: 'User'}
})

CampGroundsSchema.post('findOneAndDelete',async function(camp){
    if(camp) {
        await Review.deleteMany({_id: {$in: camp.reviews}});
    }
})

const CampGround = new mongoose.model('CampGround', CampGroundsSchema);

module.exports = CampGround; 