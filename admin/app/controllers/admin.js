var Formidable = require('formidable');
var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Settings = mongoose.model('Settings');
var Users = mongoose.model('User');
var Gallery = mongoose.model('Gallery');

var fs = require('fs');
var mkdirp = require('mkdirp');


/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
DASHBOARD
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.render = function(req, res) {
    // side menu variables; highlights active menu
    res.locals.sections = 'dashboard';
    res.render('index');
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
ARTICLES
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.articlesList = function(req, res) {
    // side menu variables; highlights active menu
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
    // side menu variables; highlights active menu
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
        metaDescription: req.body.metaDescription,
        tags: req.body.tags
    };

    var article = new Articles(articleData);

    article.save(function(err, result) {
        if (err) throw err;

        res.redirect('/admin/articles');
    });
};

exports.articlesGetEdit = function(req, res) {
    // side menu variables; highlights active menu
    res.locals.sections = 'all-articles';
    res.locals.sectionsTree = 'articles';

    var editId = req.params.id;

    Articles
        .findOne({_id: editId})
        .populate('author')
        .exec(function(err, article) {
            if (err) throw err;

            res.render('articles/edit', {
                article: article
            });
        });
};

exports.articlesPostEdit = function(req, res) {
    Articles
        .update({_id: req.body.id},
                {$set: {
                    id: req.body.id,
                    title: req.body.title,
                    content: req.body.content,
                    slug: req.body.slug,
                    author: req.body.author,
                    state: req.body.state,
                    metaTitle: req.body.metaTitle,
                    metaDescription: req.body.metaDescription,
                    tags: req.body.tags
                }},
                function(err, result) {
                    if (err) throw err;

                    res.redirect('/admin/articles');
                });
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
GALLERY
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.galleryGet = function(req, res) {
    Gallery
        .find({})
        .exec(function(err, photos) {
            if (err) throw err;

            res.json(photos);
        });
};

exports.galleryPost = function(req, res) {

    var form = new Formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        if (err) throw err;

        var photo = files.file || files.image;
        var dir =  __dirname + '/../../../uploads/';
        var uniqueName = Date.now() + photo.name;
        var path = dir + uniqueName;

        mkdirp(dir, function(err) {
            if (err) throw err;

            var src = fs.createReadStream(photo.path);
            var dest = fs.createWriteStream(path);
            
            src.pipe(dest);

            src.on('end', function() {
                fs.unlinkSync(photo.path);
            });
        });

        var photoData = {
            url: '/admin/uploads/' + uniqueName,
            slug: fields.slug,
            description: fields.description
        };

        var image = new Gallery(photoData);

        image.save(function(err, result) {
            if (err) throw err;

            res.json({location: result.url});
        });
    });
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
USERS
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.usersList = function(req, res) {
    // side menu variables; highlights active menu
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
    // side menu variables; highlights active menu
    res.locals.sections = 'new-user';
    res.locals.sectionsTree = 'users';
    res.render('users/new');
};

exports.usersPostNew = function(req, res) {

    Users
        .register(new Users({
            username: req.body.username,
            isAdmin: !!req.body.admin,
            displayName: req.body.displayName
        }), req.body.password, function(err) {
            if (err) throw err;

            res.redirect('/admin/users')
        });
};

exports.usersGetProfile = function(req, res) {
    // side menu variables; highlights active menu
    res.locals.sections = 'user-profile';
    res.locals.sectionsTree = 'users';

    Users
        .findOne({_id: req.user.id})
        .exec(function(err, user) {

            res.render('users/profile', {
                currentUser: user
            });
        });
};

exports.usersPostProfile = function(req, res) {

    Users
        .findByUsername(req.user.username, function(err, user) {
            if (err) throw err;

            var form = new Formidable.IncomingForm();

            form.parse(req, function(err, fields, files) {
                if (err) throw err;

                if (files.image.size) {
                    var photo = files.file || files.image;
                    var dir =  __dirname + '/../../../uploads/';
                    var uniqueName = Date.now() + photo.name;
                    var path = dir + uniqueName;

                    mkdirp(dir, function(err) {
                        if (err) throw err;

                        var src = fs.createReadStream(photo.path);
                        var dest = fs.createWriteStream(path);
                        
                        src.pipe(dest);

                        src.on('end', function() {
                            fs.unlinkSync(photo.path);
                        });
                    });

                    user.image = '/admin/uploads/' + uniqueName;
                }

                user.displayName = fields.displayName;
                user.about = fields.about;

                // user changed password
                if (fields.password) {
                    user.setPassword(fields.password, function(err, user) {
                        if (err) throw err;

                        // passport-local-mongoose does not save automatically
                        user.save(function(err) {
                            if (err) throw err;
                        });
                    });
                }

                user.save(function(err) {
                    if (err) throw err;

                    res.redirect('/admin/users');
                });
            });
            
        });
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
SETTINGS
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.settingsGet = function(req, res) {
    // side menu variables; highlights active menu
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