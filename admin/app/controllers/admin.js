'use strict';

const Formidable = require('formidable');
const mongoose = require('mongoose');
const Articles = mongoose.model('Article');
const Settings = mongoose.model('Settings');
const Users = mongoose.model('User');
const Gallery = mongoose.model('Gallery');

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const forms = require('../config/forms');


/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
DASHBOARD
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.render = (req, res) => {
    // side menu variables; highlights active menu
    res.locals.sections = 'dashboard';
    res.render('index');
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
ARTICLES
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.articlesList = (req, res) => {
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

exports.articlesGetNew = (req, res) => {
    // side menu variables; highlights active menu
    res.locals.sections = 'new-article';
    res.locals.sectionsTree = 'articles';
    res.render('articles/new');
};

exports.articlesPostNew = (req, res) => {

    forms.parseFormWithImage(req, (form) => {
        console.log('form: ', form);
        let articleData = {
            title: form.fields.title,
            content: form.fields.content,
            image: form.imageUrl,
            slug: form.fields.slug,
            author: form.fields.author,
            state: form.fields.state,
            createdDate: form.fields.createdDate,
            metaTitle: form.fields.metaTitle,
            metaDescription: form.fields.metaDescription,
            tags: form.fields.tags
        };

        const article = new Articles(articleData);

        article.save((err, result) => {
            if (err) throw err;

            res.redirect('/admin/articles');
        });
    });
};

exports.articlesGetEdit = (req, res) => {
    // side menu variables; highlights active menu
    res.locals.sections = 'all-articles';
    res.locals.sectionsTree = 'articles';

    const editId = req.params.id;

    Articles
        .findOne({_id: editId})
        .populate('author')
        .exec((err, article) => {
            if (err) throw err;

            res.render('articles/edit', {
                article: article
            });
        });
};

exports.articlesPostEdit = (req, res) => {
    
    forms.parseFormWithImage(req, (form) => {
        Articles
            .findById({_id: form.fields.id} , (err, article) => {
                if (err) throw err;

                article.title = form.fields.title;
                article.content = form.fields.content;
                if (form.imageUrl) article.image = form.imageUrl;
                article.slug = form.fields.slug;
                article.author = form.fields.author;
                article.state = form.fields.state;
                article.createdDate = form.fields.createdDate;
                article.metaTitle = form.fields.metaTitle;
                article.metaDescription = form.fields.metaDescription;
                article.tags = form.fields.tags;

                article.save((err, result) => {
                    if (err) throw err;

                    res.redirect('/admin/articles');
                });
            });
    });
};

exports.articlesDelete = (req, res) => {
    console.log('delete: ', req.body.id);
    
    Articles
        .remove({_id: req.body.id}, (err, removed) => {
                    if (err) throw err;

                    res.json(removed);
                });
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
GALLERY
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.galleryGet = (req, res) => {
    Gallery
        .find({})
        .exec((err, photos) => {
            if (err) throw err;

            res.json(photos);
        });
};

exports.galleryPost = (req, res) => {

    const form = new Formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        if (err) throw err;

        const photo = files.file || files.image;
        const dir =  __dirname + '/../../../uploads/';
        const uniqueName = Date.now() + photo.name;
        const path = dir + uniqueName;

        mkdirp(dir, (err) => {
            if (err) throw err;

            const src = fs.createReadStream(photo.path);
            const dest = fs.createWriteStream(path);
            
            src.pipe(dest);

            src.on('end', () => {
                fs.unlinkSync(photo.path);
            });
        });

        let photoData = {
            url: '/admin/uploads/' + uniqueName,
            slug: fields.slug,
            description: fields.description
        };

        const image = new Gallery(photoData);

        image.save((err, result) => {
            if (err) throw err;

            res.json({location: result.url});
        });
    });
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
USERS
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.usersList = (req, res) => {
    // side menu variables; highlights active menu
    res.locals.sections = 'all-users';
    res.locals.sectionsTree = 'users';

    const exclude = {
        _id: false,
        salt: false,
        hash: false,
        attempts: false
    };

    Users
        .find({}, exclude)
        .exec((err, users) => {
            if (err) throw err;

            res.render('users/all', {
                users: users
            });
        });
};

exports.usersGetNew = (req, res) => {
    // side menu variables; highlights active menu
    res.locals.sections = 'new-user';
    res.locals.sectionsTree = 'users';
    res.render('users/new');
};

exports.usersPostNew = (req, res) => {

    Users
        .register(new Users({
            username: req.body.username,
            isAdmin: !!req.body.admin,
            displayName: req.body.displayName
        }), req.body.password, (err) => {
            if (err) throw err;

            res.redirect('/admin/users')
        });
};

exports.usersGetProfile = (req, res) => {
    // side menu variables; highlights active menu
    res.locals.sections = 'user-profile';
    res.locals.sectionsTree = 'users';

    Users
        .findOne({_id: req.user.id})
        .exec((err, user) => {

            res.render('users/profile', {
                currentUser: user
            });
        });
};

exports.usersPostProfile = (req, res) => {

    Users
        .findByUsername(req.user.username, (err, user) => {
            if (err) throw err;

            const form = new Formidable.IncomingForm();

            form.parse(req, (err, fields, files) => {
                if (err) throw err;

                if (files.image.size) {
                    const photo = files.file || files.image;
                    const dir =  __dirname + '/../../../uploads/';
                    const uniqueName = Date.now() + photo.name;
                    const path = dir + uniqueName;

                    mkdirp(dir, (err) => {
                        if (err) throw err;

                        const src = fs.createReadStream(photo.path);
                        const dest = fs.createWriteStream(path);
                        
                        src.pipe(dest);

                        src.on('end', () => {
                            fs.unlinkSync(photo.path);
                        });
                    });

                    user.image = '/admin/uploads/' + uniqueName;
                }

                user.displayName = fields.displayName;
                user.about = fields.about;

                // user changed password
                if (fields.password) {
                    user.setPassword(fields.password, (err, user) => {
                        if (err) throw err;

                        // passport-local-mongoose does not save automatically
                        user.save((err) => {
                            if (err) throw err;
                        });
                    });
                }

                user.save((err) => {
                    if (err) throw err;

                    res.redirect('/admin/users');
                });
            });
            
        });
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
SETTINGS
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

exports.settingsGet = (req, res) => {
    // side menu variables; highlights active menu
    res.locals.sections = 'settings';

    Settings
        .findOne({})
        .exec((err, settings) => {
            // get themes from folder
            let folders = [];
            fs.readdir(path.join(__dirname + '/../../../content/themes'), (err, files) => {
                files.forEach((item, value) => {
                    let obj = {};
                    obj.name = item;
                    folders.push(obj);
                });
                
                res.render('settings', {
                    themes: folders,
                    settings: settings
                });
            });
        });
};

exports.settingsPost = (req, res) => {
    
    // find the unique record for settings
    Settings
        .findOneAndUpdate({}, {
            lang: req.body.lang,
            currentTheme: req.body.currentTheme,
            siteTitle: req.body.siteTitle,
            siteDescription: req.body.siteDescription
        })
        .exec((err, result) => {
            if (err) throw err;

            // no result - first save
            if (!result) {
                // create new record
                const settings = new Settings({lang: req.body.lang});

                // save it
                settings.save((err, result) => {
                    if (err) throw err;
                });
            }

            res.redirect('/admin/settings');
        });
};