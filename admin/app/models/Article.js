'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

let getTags = function(tags) {
    return tags.join(',');
};

let setTags = function(tags) {
    return tags.split(',');
};

let getDate = function(createdDate) {
    return moment(createdDate).format('LL');
};

let Article = new Schema({
    title: {type: String, required: true},
    content: String,
    image: String,
    slug: {type: String, required: true},
    author: {type: Schema.ObjectId, ref : 'User'},
    state: {type: String, default: 'draft', required: true},
    createdDate: {type: Date, default: Date.now, get: getDate},
    metaTitle: String,
    metaDescription: String,
    tags: {type: [], get: getTags, set: setTags},
});

mongoose.model('Article', Article);