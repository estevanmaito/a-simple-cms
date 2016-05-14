var Formidable = require('formidable');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

exports.parseFormWithImage = function(req, callback) {
    function hasImage(files) {
        return files.size > 0;
    };

    // create a new form
    var form = new Formidable.IncomingForm();

    // parse form's data
    form.parse(req, function(err, fields, files) {
        if (err) throw err;

        // get image file
        var image = files.file || files.image;
        if (hasImage(image)) {
            // directory where to save the images
            var dir =  __dirname + '/../../../uploads/';
            // append current date in miliseconds to image name
            var uniqueName = Date.now() + image.name;
            // join directory and image name
            var path = dir + uniqueName;

            // if directory doesn't exists, create it
            mkdirp(dir, function(err) {
                if (err) throw err;

                // create a read stream for the incoming image
                var src = fs.createReadStream(image.path);
                // create a write stream to the destination path
                var dest = fs.createWriteStream(path);
                
                // write the incoming stream to the path
                src.pipe(dest);

                // on end, unlink the read stream created
                src.on('end', function() {
                    fs.unlinkSync(image.path);
                });
            });
        }
        
        var formData = {
            imageName: uniqueName ? uniqueName : '',
            imageUrl: uniqueName ? '/uploads/' + uniqueName : '',
            fields: fields
        };

        callback(formData);
    });
};