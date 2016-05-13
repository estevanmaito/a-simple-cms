var express = require('express');
var router = express.Router();
var routes = require('../controllers');

var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');

router.use(function(req, res, next) {
    Settings
        .findOne({})
        .exec(function(err, settings) {
            if (err) throw err;

            res.locals.settings = settings;

            next();
        });
});

router.get('/', routes.home);;

router.get('/about', routes.about);

router.get('/contact', routes.contact);

router.get('/:slug', routes.article);

module.exports = router;