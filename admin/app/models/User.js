'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

let User = new Schema({
    displayName: String,
    isAdmin: {type: Boolean, default: false},
    about: String,
    image: String
});

const options = {
    interval: 3000,
    limitAttempts: true,
    maxAttempts: 3
};

User.plugin(passportLocalMongoose, options);

mongoose.model('User', User);