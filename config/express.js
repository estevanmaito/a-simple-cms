var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


module.exports = function(app) {

    // handlebars layout settings
    app.engine('hbs', handlebars({
        layoutsDir: './app/views/layouts/',
        defaultLayout: 'main',
        extname: '.hbs',
        partialsDir: './app/views/partials/',
        helpers: {
            section: function(name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
            ifeq: function(a, b, options) {
                if (a == b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
        }
    }));
    app.set('views', './app/views');
    app.set('view engine', 'hbs');
    // app.set('view cache', true);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());
    app.use(session({ secret: 'dark potato watch metallica' }));
    app.use(compress());
    app.use(express.static('public')); //, {maxAge: 43200000}));

    // Configure passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // expose locals to all views
    app.use(function(req, res, next) {
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


    // Configure passport-local to use account model for authentication
    var User = mongoose.model('User');

    // create the admin user the first time 
    // User.register(new User({
    //         username: 'teste@teste.com',
    //         isAdmin: true,
    //         displayName: 'Admin'
    //     }), 'teste', function(err) {
    //     if (err) {
    //         console.log('error while user register!', err);
    //     }
    // });

    // configures passport auth
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // routes
    require('../config/routes.js')(app);

    // error handling
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('404', {
            error: err.message
        });
    });
};