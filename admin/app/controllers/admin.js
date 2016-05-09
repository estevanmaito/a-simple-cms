var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Settings = mongoose.model('Settings');
var Users = mongoose.model('User');

exports.render = function(req, res) {
    res.locals.sections = 'dashboard';
    res.render('index');
};

exports.articlesList = function(req, res) {
    // side menu variables
    // highlights active menu
    res.locals.sections = 'all-articles';
    res.locals.sectionsTree = 'articles';

    Articles
        .find({})
        .populate('author')
        .exec(function(err, articles) {
            if (err) throw err;

            res.render('articles/all', {
                articles: articles
            });
        });
};

exports.articlesGetNew = function(req, res) {
    res.locals.sections = 'new-article';
    res.locals.sectionsTree = 'articles';
    res.render('articles/new');
};

exports.articlesPostNew = function(req, res) {
    var articleData = {
        title: req.body.title,
        content: req.body.content,
        slug: req.body.slug,
        author: req.body.author,
        state: req.body.state,
        createdDate: req.body.createdDate,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription
    };

    var article = new Articles(articleData);

    article.save(function(err, result) {
        if (err) throw err;

        res.redirect('/admin/articles');
    });
};

exports.usersList = function(req, res) {

    // side menu variables
    // highlights active menu
    res.locals.sections = 'all-users';
    res.locals.sectionsTree = 'users';

    var exclude = {
        _id: false,
        salt: false,
        hash: false,
        attempts: false
    };

    Users
        .find({}, exclude)
        .exec(function(err, users) {
            if (err) throw err;

            res.render('users/all', {
                users: users
            });
        });
};

exports.usersGetNew = function(req, res) {
    res.locals.sections = 'new-user';
    res.locals.sectionsTree = 'users';
    res.render('users/new');
};

exports.usersPostNew = function(req, res) {
    // examine the best way to register a new user
    // send email?
    // reset password
    // change password

    // var userData = {
    //     title: req.body.title,
    //     content: req.body.content,
    //     slug: req.body.slug,
    //     author: req.body.author,
    //     state: req.body.state,
    //     createdDate: req.body.createdDate,
    //     metaTitle: req.body.metaTitle,
    //     metaDescription: req.body.metaDescription
    // };

    // var user = new Articles(userData);

    // user.save(function(err, result) {
    //     if (err) throw err;

    //     res.redirect('/admin/users');
    // });
};

exports.settingsGet = function(req, res) {
    res.locals.sections = 'settings';
    res.render('settings');
};

exports.settingsPost = function(req, res) {
    
    // find the unique record for settings
    Settings
        .findOneAndUpdate({}, {lang: req.body.lang})
        .exec(function(err, result) {
            if (err) throw err;

            // no result - first save
            if (!result) {
                // create new record
                var settings = new Settings({lang: req.body.lang});

                // save it
                settings.save(function(err, result) {
                    if (err) throw err;
                });
            }

            res.redirect('/admin/settings');
        });
};