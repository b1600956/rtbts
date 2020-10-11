var mongoose = require('mongoose');
//var moment = require('moment');  For date handling.

var Schema = mongoose.Schema;

var BusSchema = new Schema({
    busNum: { type: String, required: true, max: 10},
    route: { type: Schema.Types.ObjectId, ref: 'Route', required: true},
    busCaptain: { type: String, required: true, max: 20},
    busCapContactNo: {type: String, required: true, max: 20},
    status: {type: String, required: true, max: 30}
});

BusSchema.virtual('url').get(function(){
    return '/route/'+this._id;
});

module.exports = mongoose.model('Bus', BusSchema);