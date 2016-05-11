var express = require('express');
var router = express.Router();
var admin = require('../controllers/admin');
var fs = require('fs');
var path = require('path');

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
    // res.locals.sideMenu = [
    //     {label: 'Dashboard',    key: 'dashboard',   href: '/admin',         icon: 'fa-bar-chart'},
    //     {label: 'Articles',     key: 'articles',    icon: 'fa-newspaper-o',
    //         subMenu: [
    //             {label: 'All articles',     key: 'all-articles',    href: '/admin/articles'},
    //             {label: 'New article',      key: 'new-article',     href: '/admin/articles/new'}
    //         ]
    //     },
    //     {label: 'Users',        key: 'users',       icon: 'fa-users',
    //         subMenu: [
    //             {label: 'All users',     key: 'all-users',    href: '/admin/users'},
    //             {label: 'New user',      key: 'new-user',     href: '/admin/users/new'}
    //         ]
    //     },
    //     {label: 'Settings',    key: 'settings',     href: '/admin/settings',    icon: 'fa-cogs'}
    // ];

    function getLangFile(cb) {
        Settings
            .findOne({})
            .exec(function(err, settings) {
                if (err) throw err;

                if (settings) {
                    cb(settings.lang);
                } else {
                    cb('en_US');
                }
            });
    }

    // loads synchronously the i18n data and moves on
    // it doesn't look good for me, but works for now :/
    getLangFile(function(data) {
        res.locals.lang = JSON.parse(fs.readFileSync(path.join(__dirname + '/../config/i18n/') + data + '.json'));
        next();
    });
});

router.get('/', admin.render);
router.get('/articles', admin.articlesList);
router.get('/articles/new', admin.articlesGetNew);
router.post('/articles/new', admin.articlesPostNew);
router.post('/articles/edit', admin.articlesPostEdit);
router.get('/articles/:id', admin.articlesGetEdit);

router.get('/gallery', admin.galleryGet);
router.post('/gallery', admin.galleryPost);

router.get('/users', admin.usersList);
router.get('/users/new', admin.usersGetNew);
router.post('/users/new', admin.usersPostNew);
router.get('/users/profile', admin.usersGetProfile);
router.post('/users/profile', admin.usersPostProfile);

router.get('/settings', admin.settingsGet);
router.post('/settings', admin.settingsPost);

module.exports = router;