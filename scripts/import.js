//node scripts/import.js --import-file

var script = require('./__includes.js'),
    models = script.models;
var fs = require('fs');
var async = require('async');
var moment = require('moment');

var Post = models.Post;
var User = models.User;
var mongoose      = require('mongoose');

script.bootstrap(function(err, dependencies) {
    var nconf = dependencies.nconf;
    var cloudinary = require('cloudinary');
    cloudinary.config(nconf.get('cloudinary'));

    var importFile = nconf.get('import-file');
    if (!importFile) {
        throw new Error;
    }

    var user = User.findOne(function(err, user){
        if (err) {
            throw new Error(err);
        }

        if (user) {
            then(user);
        } else {
            user = new User({
                role: 'admin',
                email: 'christophe@evaneos.com',
                name: {
                    first: 'Christophe',
                    last: 'Hurpeau',
                },
                status: 'validated',
            });

            user.save(function(){
                if (err) {
                    throw new Error(err);
                }
                then(user);
            });
        }
    });

    function then(user) {
        var i = 0;
        fs.readFile(importFile, function(err, data){
            data = JSON.parse(data);
            async.eachSeries(data, function(elt, callback){
                if (i > -1 && i++ < 4) {
                    return callback();
                }
                cloudinary.uploader.upload(elt.url, function(result) {
                    //result.public_id
                    var p = new Post({
                        name: elt.name,
                        description: elt.description,
                        type: 'image',
                        content: {
                            imageId: result.public_id,
                            imageWidth: result.width,
                            imageHeight: result.height,
                            imageFormat: result.format,
                        },
                        _userId: user._id,
                        tags: [],
                        //[lng, lat]
                        position: { lng: elt.location.lng, lat: elt.location.lat },
                        date: moment(elt.date)
                    });
                    p.save(callback);
                });
            });
        });
    }
});