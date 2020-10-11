var User = require('../models/user');
var async = require('async');

exports.index = function(req, res){
    res.render('index',{fail: false});
};

exports.user_signIn_post = function(req, res){
    if(req.body.email && req.body.password){
        User.authenticate(req.body.email, req.body.password, function(error, user){
            if(error || !user){
                res.render('index',{
                    fail: true,
                    error: "Invalid email or password! Please try again",
                    email: req.body.email,
                    password: req.body.password
                });
            } else {
                req.session.userId = user._id;
                req.session.email = user.email;
                res.redirect('/rtbts/bus/dashboard');
            }
        });
    }else {
        res.render('index',{
            fail: true,
            error: "All fields required!"
        });
    }
};

exports.user_signUp_get = function(req, res){
    res.render('signUp',{fail: false});
};

exports.user_signUp_post = function(req, res, next){
    if(req.body.firstName && 
        req.body.lastName &&
        req.body.email &&
        req.body.password){
            User.findOne({'email': req.body.email }, function(err, user){
                if(err){
                    return next(err);
                }
                if(!user){
                    let userData = {
                        email: req.body.email,
                        password: req.body.password,
                        firstname: req.body.firstName,
                        lastname: req.body.lastName
                    }

                    User.create(userData, function(error, user){
                        if(error){
                            return next(error);
                        }else{
                            req.session.userId = user._id;
                            req.session.email = user.email;
                            res.redirect('/rtbts/bus/dashboard');
                        }
                    });
                } else{
                    res.render('signUp',{
                        fail: true,
                        email: req.body.email,
                        password: req.body.password,
                        firstname: req.body.firstName,
                        lastname: req.body.lastName,
                        error : "This email has registered an account! Please go to sign in or use another account to sign up"
                    });
                }
            });
        } else {
            res.render('signUp',{
                fail: true,
                error: "All fields required!"
            });
        }
};

exports.user_logout = function(req, res, next){
    if(req.session){
        req.session.destroy(function (err){
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
};