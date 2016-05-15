'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Gallery = new Schema({
    url: String,
    slug: String,
    description: String
});

mongoose.model('Gallery', Gallery);