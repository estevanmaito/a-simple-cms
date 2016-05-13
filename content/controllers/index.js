var mongoose = require('mongoose');
var Articles = mongoose.model('Article');

exports.home = function(req, res) {
    Articles
        .find({})
        .populate('author')
        .where({state: 'published'})
        .exec(function(err, articles) {
            if (err) throw err;

            res.render('index', {articles: articles});
        });
};

exports.about = function(req, res) {
    res.render('about');
};

exports.contact = function(req, res) {
    res.render('contact');
};

exports.article = function(req, res) {
    Articles
        .findOne({slug: req.params.slug})
        .populate('author')
        .exec(function(err, article) {
            if (err) throw err;

            res.render('post', {article: article});
        });
};