exports.post = function(req, res, next) {
    res.locals.sections = 'dashboard';
    res.redirect('/admin');
};

exports.renderLogin = function(req, res, next) {
    res.render('login', {user: req.user, layout: false});
};