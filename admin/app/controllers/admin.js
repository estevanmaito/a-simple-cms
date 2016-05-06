var mongoose = require('mongoose');
var Articles = mongoose.model('Article');

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