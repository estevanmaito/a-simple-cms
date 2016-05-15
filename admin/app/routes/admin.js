'use strict';

const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
});

router.use((req, res, next) => {
    res.locals.user = req.user;

    function getLangFile(cb) {
        Settings
            .findOne({})
            .exec(function(err, settings) {
                if (err) throw err;

                if (settings) {
                    // setup moment.js locale
                    moment.locale(settings.lang.replace(/_/, '-'));
                    cb(settings.lang);
                } else {
                    cb('en_US');
                }
            });
    }

    // loads (on every request) synchronously the i18n data and moves on
    // it doesn't look good for me, but works for now :/
    // should be loaded in sessions?
    getLangFile((data) => {
        res.locals.lang = JSON.parse(fs.readFileSync(path.join(__dirname + '/../config/i18n/') + data + '.json'));
        next();
    });
});

// block content from unauthorized users
function isAdmin(req, res, next) {
    if (req.user.isAdmin) {
        return next();
    } else {
        res.render('404');
    }
};

router.get('/', admin.render);
router.get('/articles', admin.articlesList);
router.get('/articles/new', admin.articlesGetNew);
router.post('/articles/new', admin.articlesPostNew);
router.post('/articles/edit', admin.articlesPostEdit);
router.post('/articles/delete', admin.articlesDelete);
router.get('/articles/:id', admin.articlesGetEdit);

router.get('/gallery', admin.galleryGet);
router.post('/gallery', admin.galleryPost);

router.get('/users', admin.usersList);
router.get('/users/new', isAdmin, admin.usersGetNew);
router.post('/users/new', isAdmin, admin.usersPostNew);
router.get('/users/profile', admin.usersGetProfile);
router.post('/users/profile', admin.usersPostProfile);

router.get('/settings', isAdmin, admin.settingsGet);
router.post('/settings', isAdmin, admin.settingsPost);

module.exports = router;