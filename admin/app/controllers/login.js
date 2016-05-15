exports.post = (req, res, next) => {
    res.locals.sections = 'dashboard';
    res.redirect('/admin');
};

exports.renderLogin = (req, res, next) => {
    res.render('login', {user: req.user, layout: false});
};