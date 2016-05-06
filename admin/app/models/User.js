var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    displayName: String,
    isAdmin: {type: Boolean, default: false}
});

var options = {
    interval: 3000,
    limitAttempts: true,
    maxAttempts: 3
};

User.plugin(passportLocalMongoose, options);

mongoose.model('User', User);