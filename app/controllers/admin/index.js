// var mongoose = require('mongoose');
// var Articles = mongoose.model('Article');

function AdminIndexHandler () {
    
    this.render = function(req, res) {
        res.locals.sections = 'dashboard';
        res.render('admin/index', {layout: 'admin'});
    };
}

module.exports = AdminIndexHandler;