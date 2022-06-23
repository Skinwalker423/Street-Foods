const User = require('../models/user');

module.exports.renderRegistrationForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerNewUser = async(req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = await new User({ username, email })
        const newUser = await User.register(user, `${password}`);
        req.login(newUser, err => {
            if(err){
                return next(err);
            }
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
    req.flash('success', 'You have successfully registered with Yelp Camp!')
    res.redirect('/campgrounds');
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirected = req.session.returnTo || '/campgrounds';
    res.redirect(redirected);
}

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'You are logged out');
    res.redirect('/campgrounds');
}