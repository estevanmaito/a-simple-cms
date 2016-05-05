var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({
    title: String,
    content: String,
    slug: String,
    author: {type: Schema.ObjectId, ref : 'User'},
    state: {type: String, default: 'draft'},
    createdDate: {type: Date, default: Date.now},
    metaTitle: String,
    metaDescription: String,
    // tags: String TODO
});

mongoose.model('Article', Article);