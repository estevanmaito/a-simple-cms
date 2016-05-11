var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Gallery = new Schema({
    url: String,
    slug: String,
    description: String
});

mongoose.model('Gallery', Gallery);