'use strict';

const express = require('express');
const router = express.Router();
const routes = require('../controllers');

const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');

router.use((req, res, next) => {
    Settings
        .findOne({})
        .exec((err, settings) => {
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