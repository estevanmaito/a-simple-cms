'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const path = require('path');

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


module.exports = (app) => {

    // handlebars layout settings
    app.engine('hbs', handlebars({
        layoutsDir: path.join(__dirname, '/../views/layouts/'),
        defaultLayout: 'admin',
        extname: '.hbs',
        partialsDir: path.join(__dirname, '/../views/partials/'),
        helpers: {
            section: (name, options) => {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
            ifeq: (a, b, options) => {
                if (a == b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
        }
    }));
    app.set('views', path.join(__dirname, '/../views'));
    app.set('view engine', 'hbs');
    // app.set('view cache', true);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());
    app.use(session({ secret: process.env.COOKIE_SECRET }));
    app.use(compress());
    app.use('/admin', express.static('admin/public')); //, {maxAge: 43200000}));
    app.use('/admin/uploads', express.static('uploads')); //, {maxAge: 43200000}));

    // Configure passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure passport-local to use account model for authentication
    const User = mongoose.model('User');

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
    app.use('/admin', require('../routes/admin'));
    app.use('/login', require('../routes/login'));
    app.use('/logout', require('../routes/logout'));
    // require('../config/routes.js')(app);

    // error handling
    app.use((err, req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('404', {
            error: err.message
        });
    });
};