var express = require('express');
var router = express.Router();
var admin = require('../controllers/admin');

router.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
});

router.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.sideMenu = [
        {label: 'Dashboard',    key: 'dashboard',   href: '/admin'},
        {label: 'Articles',     key: 'articles',
            subMenu: [
                {label: 'All articles',     key: 'all-articles',    href: '/admin/articles'},
                {label: 'New article',      key: 'new-article',     href: '/admin/articles/new'}
            ]
        }
    ];

    next();
});

router.get('/', admin.render);
router.get('/articles', admin.articlesList);
router.get('/articles/new', admin.articlesGetNew);
router.post('/articles/new', admin.articlesPostNew);

module.exports = router;