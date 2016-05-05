var dotenv = require('dotenv');
var mongoose = require('mongoose');
var express = require('express');
var fs = require('fs');

dotenv.config();

var app = express();

mongoose.connect(process.env.MONGO_URL);

// register models
var modelsPath = __dirname + '/app/models/';
fs.readdirSync(modelsPath)
    .filter(function (file) {return ~file.search(/^[^\.].*\.js$/);})
    .forEach(function (file) {require(modelsPath + file)});

require('./config/express.js')(app);

app.listen(process.env.PORT, function() {
    console.log('Express server listening on port ' + process.env.PORT);
});