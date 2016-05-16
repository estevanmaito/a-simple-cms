'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const path = require('path');

const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');

module.exports = (publicApp) => {

    let currentTheme;


    // reads the current theme
    // SHOULD UPDATE ON THEME CHANGE
    Settings
        .findOne({})
        .exec(function(err, settings) {
            if (err) throw err;

            currentTheme = settings.currentTheme;

            // handlebars layout settings
            publicApp.engine('hbs', handlebars({
                layoutsDir: path.join(__dirname, '/../themes/' + currentTheme + '/'),
                defaultLayout: 'default',
                extname: '.hbs',
                partialsDir: path.join(__dirname, '/../themes/' + currentTheme + '/partials/'),
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
                    },
                    shorten: function(str) {
                        if (str.length > 150) {
                            return str.substring(0, 150) + '...';
                        }
                        return str;
                    }
                }
            }));
            publicApp.set('views', path.join(__dirname, '/../themes/' + currentTheme + '/'));
            publicApp.set('view engine', 'hbs');
            // publicApp.set('view cache', true);

            publicApp.use(bodyParser.json());
            publicApp.use(bodyParser.urlencoded({
                extended: true
            }));

            publicApp.use(cookieParser());
            publicApp.use(session({ secret: process.env.COOKIE_SECRET }));
            publicApp.use(compress());
            publicApp.use('/public', express.static('content/themes/' + currentTheme + '/public')); //, {maxAge: 43200000}));
            publicApp.use('/uploads', express.static('uploads'));

            // routes
            publicApp.use('/', require('../routes'));
            // require('../config/routes.js')(publicApp);

            // error handling
            publicApp.use((req, res, next) => {
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
            });

            publicApp.use((err, req, res, next) => {
                res.status(err.status || 500);
                res.render('404', {
                    error: err.message
                });
            });
                    
        });
};