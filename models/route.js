var mongoose = require('mongoose');
//var moment = require('moment');  For date handling.

var Schema = mongoose.Schema;

var RouteSchema = new Schema({
    routeNum: { type: String, required: true, max: 10},
    numOfBusStop: { type: Number, required: true},
    departure: { type: String, required: true, max: 50, trim: true},
    arrival : {type: String, required: true, max: 50, trim: true},
    busStops: [{type: Schema.Types.ObjectId, ref: 'BusStop'}]
});

RouteSchema.virtual('url').get(function(){
    return '/route/'+this._id;
});

module.exports = mongoose.model('Route', RouteSchema);