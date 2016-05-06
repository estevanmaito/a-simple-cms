var dotenv = require('dotenv');
var mongoose = require('mongoose');
var express = require('express');
var fs = require('fs');
var path = require('path');

dotenv.config();

var app = express();

mongoose.connect(process.env.MONGO_URL);

// register models
var modelsPath = path.join(__dirname, '/admin/app/models/');
fs.readdirSync(modelsPath)
    .filter(function (file) {return ~file.search(/^[^\.].*\.js$/);})
    .forEach(function (file) {require(modelsPath + file)});

require(path.join(__dirname + '/admin/app/config/express.js'))(app);

app.listen(process.env.PORT, function() {
    console.log('Express server listening on port ' + process.env.PORT);
});