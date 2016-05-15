'use strict';

const mongoose = require('mongoose');
const Articles = mongoose.model('Article');

exports.home = (req, res) => {
    Articles
        .find({})
        .populate('author')
        .where({state: 'published'})
        .exec((err, articles) => {
            if (err) throw err;

            res.render('index', {articles: articles});
        });
};

exports.about = (req, res) => {
    res.render('about');
};

exports.contact = (req, res) => {
    res.render('contact');
};

exports.article = (req, res) => {
    Articles
        .findOne({slug: req.params.slug})
        .populate('author')
        .exec((err, article) => {
            if (err) throw err;

            res.render('post', {article: article});
        });
};