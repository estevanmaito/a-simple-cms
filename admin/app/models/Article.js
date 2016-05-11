var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var getTags = function(tags) {
    return tags.join(',');
};

var setTags = function(tags) {
    return tags.split(',');
};

var getDate = function(createdDate) {
    return moment(createdDate).format('L');
};

var Article = new Schema({
    title: {type: String, required: true},
    content: String,
    slug: {type: String, required: true},
    author: {type: Schema.ObjectId, ref : 'User'},
    state: {type: String, defautl: 'draft', required: true},
    createdDate: {type: Date, default: Date.now, get: getDate},
    metaTitle: String,
    metaDescription: String,
    tags: {type: [], get: getTags, set: setTags},
});

mongoose.model('Article', Article);