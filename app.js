'use strict';

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');

dotenv.config();

// create parent app
const app = express();

// admin app
const adminApp = express();
// public app
const publicApp = express();

// connect mongoose
mongoose.connect(process.env.MONGO_URL);

// register models
const modelsPath = path.join(__dirname, '/admin/app/models/');
fs.readdirSync(modelsPath)
    .filter((file) => {return ~file.search(/^[^\.].*\.js$/);})
    .forEach((file) => {require(modelsPath + file)});

// configs and routes
require(path.join(__dirname + '/admin/app/config/express.js'))(adminApp);
require(path.join(__dirname + '/content/config/express.js'))(publicApp);

app.use(adminApp, publicApp);

app.listen(process.env.PORT, () => {
    console.log('Express server listening on port ' + process.env.PORT);
});