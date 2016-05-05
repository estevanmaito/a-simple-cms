var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function UserHandler () {

    this.renderLogin = function(req, res, next) {
        res.render('admin/login', {user: req.user, layout: false});
    };

    this.login = function(req, res, next) {
        res.locals.sections = 'dashboard';
        res.redirect('/admin');
    };

    this.logout = function(req, res) {
        req.logout();
        res.redirect('/login');
    };

    this.addUser = function(req, res, next) {
        User.register(new User({username: req.body.username}), req.body.password, function(err) {
            if (err) {
                console.log('error while user register!', err);
                return next(err);
            }

            res.redirect('/admin');
        });
    };
}

module.exports = UserHandler;