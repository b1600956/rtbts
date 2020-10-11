var Bus = require('../models/bus');
var User = require('../models/user');
var Route = require('../models/route');
var awsIot = require('aws-iot-device-sdk');  
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1', endpoint: "https://dynamodb.us-east-1.amazonaws.com"});
var docClient = new AWS.DynamoDB.DocumentClient();
var app = require('../app.js');
var http = require('http');
var server = http.createServer(app);
const io = require('socket.io').listen(server);
server.listen(8080);
const INIT_DELAY = 15; 
const TAG = '[aws-iot-device] >>>>>>>>> ';
var theRoutes;
var theBus;

exports.bus_dashboard = function(req, res){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                io.on('connection',function(socket){  
                    console.log("A user is connected");
                });
                res.render('dashboard', {
                    userEmail : user.email,
                    awsIot : awsIot,
                    INIT_DELAY : INIT_DELAY,
                    TAG : TAG,
                    io : io
                });
            }
        }
    });
};

exports.bus_list = function(req, res){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                Bus.find({}, '_id busNum route busCaptain busCapContactNo status').populate('route').exec(function (err, buses){
                    if(err){
                        return next(err);
                    }else{
                        res.render('viewBus', {
                            userEmail : user.email,
                            busList : buses
                        });
                    }
                });
            }
        }
    });
};

exports.bus_detail = function(req, res,next){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                Bus.findById(req.params.id).populate('route').exec(function (err, bus){
                    if(err){
                        return next(err);
                    }else{
                        if(bus === null){
                            res.redirect('/rtbts/buses')
                        }else{
                            res.render('busDetail', {
                                userEmail : user.email,
                                theBus : bus
                            });
                        }
                    }
                });
            }
        }
    });
};

exports.bus_create_get = function(req, res, next){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                Route.find({}, '_id routeNum departure arrival').exec(function (err, routes){
                    if(err){
                        return next(err);
                    }else{
                        theRoutes = routes;
                        res.render('addBus', {
                            fail : false,
                            userEmail : user.email,
                            routeList : routes
                        });
                    }
                });
            }
        }
    });
};

exports.bus_create_post = function(req, res, next){
    if(req.body.busNo &&
        req.body.route &&
        req.body.busCap &&
        req.body.contactNum){
            Bus.findOne({'busNum': req.body.busNo }, function(err, bus){
                if(err){
                    return next(err);
                }
                if(!bus){
                    console.log("can get");
                    let theStatus = "Operating";
                    let busData = {
                        busNum: req.body.busNo,
                        route: req.body.route,
                        busCaptain: req.body.busCap,
                        busCapContactNo: req.body.contactNum,
                        status: theStatus
                    }
                    Bus.create(busData, function(error, bus){
                        if(error){
                            return next(err);
                        }else{
                            res.render('addBus',{
                                success : true,
                                fail : false,
                                busNo : bus.busNum,
                                userEmail : req.session.email,
                                routeList : theRoutes
                            });
                        }
                    });
                } else{
                    res.render('addBus',{
                        success : false,
                        fail: true,
                        busNo: req.body.busNo,
                        route : req.body.route,
                        busCap : req.body.busCap,
                        contactNum : req.body.contactNum,
                        error : "This bus plate number already exists.",
                        userEmail : req.session.email,
                        routeList : theRoutes
                    });
                }
            });
        }else {
            console.log("fail");
            return next(new Error('All fields required!'));
        }
};

exports.bus_realTime = function(req, res, next){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                Bus.findById(req.params.id).exec(function (err, bus){
                    if(err){
                        return next(err);
                    }else{
                        if(bus === null){
                            res.redirect('/rtbts/buses')
                        }else{
                            Route.findById(bus.route).populate('busStops').exec(function (err, route){
                                if(err){
                                    return next(err);
                                }else{
                                    if(route === null){
                                        res.redirect('/rtbts/bus')
                                    }else{
                                        res.render('busRealTime', {
                                            userEmail : user.email,
                                            awsIot : awsIot,
                                            INIT_DELAY : INIT_DELAY,
                                            TAG : TAG,
                                            io : io,
                                            theBus : bus,
                                            theRoute : route 
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};

exports.bus_travelHistory_get = function(req, res, next){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                Bus.findById(req.params.id).populate('route').exec(function (err, bus){
                    if(err){
                        return next(err);
                    }else{
                        if(bus === null){
                            res.redirect('/rtbts/buses')
                        }else{
                            theBus = bus;
                            res.render('busTravelHistory', {
                                userEmail : user.email,
                                theBus : bus,
                                fail : false,
                                success : false
                            });
                        }
                    }
                });
            }
        }
    });
};

exports.bus_travelHistory_post = function(req, res, next){
    Bus.findById(req.params.id).populate('route').exec(function (err, bus){
        if(err){
            return next(err);
        }else{
            if(bus === null){
                res.redirect('/rtbts/buses')
            }else{
                if(req.body.date &&
                    req.body.time){
                         var dateFormat = req.body.date.split('-');
                           var params = {
                               TableName: 'busTable',
                               KeyConditionExpression: "#dt = :ddmmyyyy and #tm between :hhmm1 and :hhmm2",
                               ExpressionAttributeNames:{
                                   "#dt": "date",
                                   "#tm": "time"
                               },
                               ExpressionAttributeValues:{
                                   ":ddmmyyyy" : dateFormat[2]+'/'+dateFormat[1]+'/'+dateFormat[0],
                                   ":hhmm1" : req.body.time + ':00',
                                   ":hhmm2" : req.body.time + ':99'
                               }
                             };
                          
                             //Call DynamoDB to read the item from the table
                             docClient.query(params, function(err, data) {
                               if (err) {
                                 console.log("Unable to query. Error: ", JSON.stringify(err, null, 2));
                                 return next(err);
                               } else {
                                   if(data.Items.length > 0){
                                     console.log("Query succeeded. " + data.Items.length+" item(s) found.");
                                     res.render('busTravelHistory', {
                                         userEmail : req.session.email,
                                         theBus : bus,
                                         latitude : data.Items[0].busInfo.latitude,
                                         longitude : data.Items[0].busInfo.longitude,
                                         speed : data.Items[0].busInfo.speed,
                                         date : req.body.date,
                                         time : req.body.time,
                                         fail : false,
                                         success : true
                                     });
                                  }else{
                                     res.render('busTravelHistory', {
                                         userEmail : req.session.email,
                                         theBus : theBus,
                                         date : req.body.date,
                                         time : req.body.time,
                                         fail : true,
                                         success : false
                                      });
                                      console.log('No Items found');
                                 }
                              }
                            });
                    }else {
                        console.log("fail");
                        return next(new Error('All fields required!'));
                    }
            }
        }
    });
};

exports.bus_edit_get = function(req, res, next){
    User.findById(req.session.userId).exec(function(error, user){
        if(error){
            res.redirect('/rtbts');
        } else {
            if(user === null) {
                res.redirect('/rtbts');
            } else{
                Bus.findById(req.params.id).populate('route').exec(function (err, bus){
                    if(err){
                        return next(err);
                    }else{
                        if(bus === null){
                            res.redirect('/rtbts/buses')
                        }else{
                            Route.find({}, '_id routeNum departure arrival').exec(function (err, routes){
                                if(err){
                                    return next(err);
                                }else{
                                    theRoutes = routes;
                                    res.render('editBus', {
                                        userEmail : user.email,
                                        routeList : routes,
                                        theBus : bus
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

exports.bus_edit_post = function(req, res, next){
    if(req.body.route &&
        req.body.busCap &&
        req.body.contactNum){
            Bus.findById(req.params.id).populate('route').exec(function (err, bus){
                if(err){
                    return next(err);
                }else{
                    if(bus === null){
                        res.redirect('/rtbts/buses')
                    }else{
                        Bus.updateOne({_id:req.params.id}, {$set:{ route:req.body.route, busCaptain:req.body.busCap, busCapContactNo:req.body.contactNum}},
                            function(err, doc){
                                if(err){
                                    return next(err);
                                }else{
                                    // res.render('editBus', {
                                    //     userEmail : req.session.email,
                                    //     theBus : bus,
                                    //     routeList : theRoutes
                                    // });
                                    res.redirect('/rtbts/bus/' + req.params.id);
                                }
                            })
                    }
                }
            });
        }else{
            return next(new Error('All fields required'));
        }
}