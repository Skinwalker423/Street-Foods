if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// console.log(process.env.SECRET);


const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./Utilities/ExpressError');
const app = express()
const campgroundsRoutes = require('./routes/campgrounds.js');
const reviewsRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected main index')
});

app.engine('ejs', engine);

app.set('views', path.join(__dirname, 'views' ))
app.set('view engine', 'ejs')

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

const week = 604800000;  // a week in miliseconds
const sessionConfig = {
    secret: 'thisneedstobearealsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + week,
        maxAge: week 
    }
}

app.use(cookieParser('test'));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/fakeUser', async (req, res) => {
    const user = new User({
        email: 'skinwalker@gmail.com',
        username: 'Skin23'
    })
    const newUser = await User.register(user, 'passportpassword');
    res.send(newUser);
})

app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', userRoutes);




app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (err, req, res, next) => {
    next(new ExpressError('woops', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong'} = err;
    
    if(!err.message){
        err.message = 'Woops, something went wrong';
        console.log(err);
    }
    
    res.status(statusCode).render('nada', { err, statusCode, message });
})


app.listen(3000, () => {
    console.log('listening to port 3000')
})
