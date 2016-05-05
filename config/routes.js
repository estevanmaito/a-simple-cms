var Index = require('../app/controllers/index.js');
var Article = require('../app/controllers/admin/articles.js');
var AdminIndex = require('../app/controllers/admin/index.js');
var User = require('../app/controllers/admin/user.js');
var passport = require('passport');

module.exports = function(app) {

    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }

    var index = new Index();
    var article = new Article();
    var admin = new AdminIndex();
    var user = new  User();
    
    app.get('/login', user.renderLogin);
    app.post('/login', passport.authenticate('local'), user.login);
    app.get('/logout', user.logout);

    app.get('/admin', isLoggedIn, admin.render);

    app.get('/admin/articles', isLoggedIn, article.renderAll);
    app.get('/admin/articles/new', isLoggedIn, article.renderNew);
    app.post('/admin/articles/new', isLoggedIn, article.addArticle);

    app.get('/', index.getArticlesList);
    app.get('/:slug', article.render);
};