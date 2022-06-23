const isLoggedIn = (req, res, next) => {
        if(!req.isAuthenticated()) {
            const {id} = req.params;
            req.flash('error', 'You need to be logged in');
            if (req.originalUrl === `/campgrounds/${id}/reviews`){
                return res.redirect(`/campgrounds/${id}`);
                
            } else{
                req.session.returnTo = req.originalUrl;
                return res.redirect('/login');
            }
            
        } else {
            next();
        }
}

module.exports = isLoggedIn;