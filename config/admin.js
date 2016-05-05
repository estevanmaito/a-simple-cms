/*
General admin settings
*/

exports.sideMenu = function(req, res, next) {
    var locals = res.locals;

    locals.admin.sideMenu = [
        {label: 'Dashboard',    key: 'dashboard',   href: '/admin'},
        {label: 'Articles',     key: 'articles',
            subMenu: [
                {label: 'All articles',     key: 'all-articles',    href: '/admin/articles'},
                {label: 'New article',      key: 'new-article',     href: '/admin/articles/new'},
                {label: 'Tags',             key: 'tags',            href: '/admin/articles/tags'},
                {label: 'Copy article',     key: 'copy-article',    href: '/admin/articles/copy'}
            ]
        }
    ];

    next();
};