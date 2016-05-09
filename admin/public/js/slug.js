var slug = require('slug');

slug.defaults.modes['pretty'] = {
    replacement: '-',
    symbols: true,
    remove: /[.]/g,
    lower: true,
    charmap: slug.charmap,
    multicharmap: slug.multicharmap
};

var titleField = document.getElementById('title');
var slugField = document.getElementById('slug');

titleField.addEventListener('change', function(e) {
    slugField.value = slug(titleField.value);
}, false);