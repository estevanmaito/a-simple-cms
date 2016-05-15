'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Settings = new Schema({
    lang: String,
    currentTheme: String,
    siteTitle: String,
    siteDescription: String
});

// ADD
// - articles per page
// - admin theme colors
// - site title and description

mongoose.model('Settings', Settings);