var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Settings = new Schema({
    lang: String
});

mongoose.model('Settings', Settings);