const mongoose = require('mongoose');
const CampGround = require('../models/campground');
const cities = require('./cities');
const { descriptors, places }= require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected in seeds');
});

function randomElementInArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function randomNum(num) {
  return Math.floor(Math.random() * num);
}

const seeDB = async function() {
    await CampGround.deleteMany({});
    
    for(let i = 0; i < 50; i++) {
      
      const randCities = randomElementInArray(cities);
      const randTitle = `${randomElementInArray(descriptors)} ${randomElementInArray(places)}`
      const price = randomNum(100);
      const camp = await new CampGround({
        location: `${randCities.city}, ${randCities.state}`,
        geometry: {
          type: "Point",
          coordinates: [randCities.longitude, randCities.latitude]
        },
        title: randTitle,
        images: [{url: "https://res.cloudinary.com/dfhgztcak/image/upload/v1656024166/YelpCamp/zuotnrwj4c97ul51au9k.png", filename: 'foodTruck'}, {url: "https://res.cloudinary.com/dfhgztcak/image/upload/v1656024167/YelpCamp/r0na7oe3rupdd3cy2mrf.png", filename: 'snacksanddrinks'}],
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab laboriosam eveniet dicta. Excepturi neque optio dolorum saepe odit corporis obcaecati labore, molestiae quasi cumque, dignissimos aperiam repellat, totam at sed?",
        price: price,
        author: '62241102f2d66a07a9281951'
      })
      await camp.save();
    }
}

seeDB().then(() => {
  mongoose.connection.close(); 
  console.log('disconnected from db');
}).catch((err) => {
  console.log(err)
});

