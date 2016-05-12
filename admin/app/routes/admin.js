var express = require('express');
var router = express.Router();
var admin = require('../controllers/admin');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');

router.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
});

router.use(function(req, res, next) {
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
    getLangFile(function(data) {
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