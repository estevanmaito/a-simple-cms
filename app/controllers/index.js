var mongoose = require('mongoose');
var Articles = mongoose.model('Article');

function IndexHandler () {
    
    this.getArticlesList = function(req, res) {
        Articles
            .find({})
            .exec(function(err, result) {
                if (err) throw err;

                res.render('index', {
                    articles: result
                });
            });
    };
}

module.exports = IndexHandler;