var dotenv = require('dotenv');
var mongoose = require('mongoose');
var express = require('express');
var fs = require('fs');
var path = require('path');

dotenv.config();

// create parent app
var app = express();

// admin app
var adminApp = express();
// public app
var publicApp = express();

// connect mongoose
mongoose.connect(process.env.MONGO_URL);

// register models
var modelsPath = path.join(__dirname, '/admin/app/models/');
fs.readdirSync(modelsPath)
    .filter(function (file) {return ~file.search(/^[^\.].*\.js$/);})
    .forEach(function (file) {require(modelsPath + file)});

// configs and routes
require(path.join(__dirname + '/admin/app/config/express.js'))(adminApp);
require(path.join(__dirname + '/content/config/express.js'))(publicApp);

app.use(adminApp, publicApp);

app.listen(process.env.PORT, function() {
    console.log('Express server listening on port ' + process.env.PORT);
});