var mongoose = require('mongoose');
var brcypt = require('bcryptjs');
//var moment = require('moment');  For date handling.

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String, required: true, max: 50, trim: true},
    password: { type: String, required: true, max: 60, trim: true},
    firstname: { type: String, required: true, max: 30},
    lastname : {type: String, required: true, max: 30}
});

UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({email: email }).exec(function (err, user){
        if(err){
            return callback(err);
        }else if(!user){
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }
        brcypt.compare(password, user.password, function (err, result){
            if(result === true){
                return callback(null, user);
            } else {
                return callback();
            }
        });
    });
}

UserSchema.pre('save', function(next){
    var user = this;
    brcypt.hash(user.password, 10, function (err, hash){
        if(err){
            return next(err);
        }
        user.password = hash;
        next();
    });
});
var User = mongoose.model('User', UserSchema);
module.exports = User;

