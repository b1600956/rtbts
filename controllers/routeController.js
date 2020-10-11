var Route = require('../models/route');
var User = require('../models/user');
var BusStop = require('../models/busStop');

exports.route_list = function(req, res, next){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                Route.find({}, '_id routeNum departure arrival numOfBusStop').exec(function (err, routes){
                    if(err){
                        return next(err);
                    }else{
                        res.render('viewRoute', {
                            userEmail : user.email,
                            routeList : routes
                        });
                    }
                });
            }
        }
    });
};

exports.route_detail = function(req, res, next){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                Route.findById(req.params.id).populate('busStops').exec(function (err, route){
                    if(err){
                        return next(err);
                    }else{
                        if(route === null){
                            res.redirect('/rtbts/routes')
                        }else{
                            res.render('routeDetail', {
                                userEmail : user.email,
                                theRoute : route
                            });
                        }
                    }
                });
            }
        }
    });
};

exports.route_create_get = function(req, res){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                res.render('addRoute', {
                    userEmail : user.email,
                    fail : false,
                    success : false
                });
            }
        }
    });
};

exports.route_create_post = function(req, res, next){
    let busStopList = [];
    if(req.body.routeNo &&
        req.body.busStop &&
        req.body.address &&
        req.body.latitude &&
        req.body.longitude){
            console.log("ok");
            Route.findOne({'routeNum': req.body.routeNo }, function(err, route){
                if(err){
                    return next(err);
                }
                if(!route){
                    console.log("can get");
                    for(let index = req.body.busStop.length - 1; index >= 0; index--){
						console.log(req.body.busStop[index]);
						console.log(req.body.address[index]);
                        let busStopData = {
                            name: req.body.busStop[index].replace(/(\r\n|\n|\r)/gm," ").replace("/","//"),
                            address: req.body.address[index].replace(/(\r\n|\n|\r)/gm," ").replace("/","//"),
                            latitude: req.body.latitude[index],
                            longitude: req.body.longitude[index]
                        }

                        BusStop.create(busStopData, function(error, busStop){
                            if(error){
                                return next(error);
                            }else{
                                busStopList.push(busStop);
                            }
                        });
                    }
                    
                    let routeData = {
                        routeNum: req.body.routeNo,
                        numOfBusStop: req.body.busStop.length,
                        departure: req.body.busStop[req.body.busStop.length-1],
                        arrival: req.body.busStop[0],
                        busStops: busStopList
                    }
                    Route.create(routeData, function(error, route){
                        if(error){
                            return next(err);
                        }else{
                            for(let i = 0; i < busStopList.length; i++){
                                route.busStops.push(busStopList[i]);
                            }
                            route.save();
                            res.render('addRoute',{
                                success : true,
                                fail : false,
                                routeNo : route.routeNum,
                                userEmail : req.session.email
                            });
                        }
                    });
                } else{
                    res.render('addRoute',{
                        success : false,
                        fail: true,
                        routeNo: req.body.routeNo,
                        error : "This route number already exists.",
                        userEmail : req.session.email
                    });
                }
            });
        }else{
            console.log("fail");
            return next(new Error('All fields required!'));
        }
};