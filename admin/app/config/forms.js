'use strict';

const Formidable = require('formidable');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

exports.parseFormWithImage = (req, callback) => {
    function hasImage(files) {
        return files.size > 0;
    };

    // create a new form
    const form = new Formidable.IncomingForm();

    // parse form's data
    form.parse(req, function(err, fields, files) {
        if (err) throw err;

        // get image file
        const image = files.file || files.image;
        if (hasImage(image)) {
            // directory where to save the images
            const dir =  __dirname + '/../../../uploads/';
            // append current date in miliseconds to image name
            const uniqueName = Date.now() + image.name;
            // join directory and image name
            const path = dir + uniqueName;

            // if directory doesn't exists, create it
            mkdirp(dir, (err) => {
                if (err) throw err;

                // create a read stream for the incoming image
                const src = fs.createReadStream(image.path);
                // create a write stream to the destination path
                const dest = fs.createWriteStream(path);
                
                // write the incoming stream to the path
                src.pipe(dest);

                // on end, unlink the read stream created
                src.on('end', () => {
                    fs.unlinkSync(image.path);
                });
            });
        }
        
        let formData = {
            imageName: uniqueName ? uniqueName : '',
            imageUrl: uniqueName ? '/uploads/' + uniqueName : '',
            fields: fields
        };

        callback(formData);
    });
};