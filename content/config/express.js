var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var path = require('path');

module.exports = function(publicApp) {

    // handlebars layout settings
    publicApp.engine('hbs', handlebars({
        layoutsDir: path.join(__dirname, '/../views/layouts/'),
        defaultLayout: 'default',
        extname: '.hbs',
        partialsDir: path.join(__dirname, '/../views/partials/'),
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
    publicApp.set('views', path.join(__dirname, '/../views'));
    publicApp.set('view engine', 'hbs');
    // publicApp.set('view cache', true);

    publicApp.use(bodyParser.json());
    publicApp.use(bodyParser.urlencoded({
        extended: true
    }));

    publicApp.use(cookieParser());
    publicApp.use(session({ secret: process.env.COOKIE_SECRET }));
    publicApp.use(compress());
    publicApp.use('/public', express.static('content/public')); //, {maxAge: 43200000}));

    // routes
    publicApp.use('/', require('../routes'));
    // require('../config/routes.js')(publicApp);

    // error handling
    publicApp.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    publicApp.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('404', {
            error: err.message
        });
    });
};