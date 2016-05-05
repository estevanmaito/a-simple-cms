var mongoose = require('mongoose');
var Articles = mongoose.model('Article');

function ArticleHandler () {

    this.render = function(req, res) {
        Articles
            .findOne({slug: req.params.slug})
            .populate('author')
            .exec(function(err, article) {
                if (err) throw err;
                console.log(article);
                res.render('article', {
                    article: article
                });
            });
    };    

    this.renderNew = function(req, res) {
        res.locals.sections = 'new-article';
        res.locals.sectionsTree = 'articles';
        res.render('admin/articles/new', {layout: 'admin'});
    };

    this.renderAll = function(req, res) {
        // side menu variables
        // highlights active menu
        res.locals.sections = 'all-articles';
        res.locals.sectionsTree = 'articles';

        Articles
            .find({})
            .populate('author')
            .exec(function(err, articles) {
                if (err) throw err;

                res.render('admin/articles/all', {
                    layout: 'admin',
                    articles: articles
                });
            });
    };
    
    this.addArticle = function(req, res) {
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
}

module.exports = ArticleHandler;