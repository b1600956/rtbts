var mongoose = require('mongoose');
//var moment = require('moment');  For date handling.

var Schema = mongoose.Schema;
var Float = require('mongoose-float').loadType(mongoose, 10);

var BusStopSchema = new Schema({
    name: { type: String, required: true, max: 50, trim: true},
    address: { type: String, required: true, max: 200, trim: true},
    latitude : {type: Float, required: true},
    longitude : {type: Float, required: true}
});

module.exports = mongoose.model('BusStop', BusStopSchema);