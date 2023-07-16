const User = require('../models/user');

module.exports.registerUser = (req,res)=>{
    res.render('users/register');
}
module.exports.renderRegister = async(req,res)=>{
    try{
        const{username, email, password} = req.body;
        const user = new User({email, username});
        const registerUser = await User.register(user, password);
        req.login(registerUser,err =>{
            if(err) return next(err)
            req.flash('success','Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })
        
    }
    catch(e){
        req.flash('error', e.message)
        res.redirect('/register');
    }
}

module.exports.loginUser = (req,res)=>{
    res.render('users/login');
}

module.exports.renderLogin = (req,res)=>{
    req.flash('success', 'Welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logoutUser =  (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}