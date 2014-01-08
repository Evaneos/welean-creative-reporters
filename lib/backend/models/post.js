var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var utils         = require(__BACKEND + 'utils');
var async         = require('async');
var moment        = require('moment');
var User = require('./user').User;

/**
 * SCHEMA
 */

var schema = new Schema({
    name: { type: String },
    description: { type: String },
    type: { type: String }, //image|video|sound|text
    content: Schema.Types.Mixed,
    _userId: Schema.ObjectId,
    tags: [String],
    starredCount: { type: Number, 'default': 0 },
    starredBy: [Schema.ObjectId],
    position: { lng: Number, lat: Number },
    date: Date,
    uploaded: { type: Date, 'default': Date.now }
});

schema.virtual('name.full').get(function() {
    return this.name.first + ' ' + this.name.last;
});

schema.index({ tags: 1, type: -1 });
schema.index({ position: '2dsphere' });

/**
 * MIDDLEWARE
 */


/**
 * STATICS
 */
schema.statics.search = function(options, user, callback) {
    var query = {};
    var sort = '';


    // parse filter
    if (options.filter) {
        switch (options.filter) {
            case 'popularity':
                sort = '-starredCount -uploaded';
                break;
            case 'uploaded':
                sort = '-uploaded';
                break;
            case 'personal':
                if (!user) {
                    return callback(null, { posts: [] });
                }
                sort = '-uploaded';
                //if (user) query._userId = user._id;
                query.starredBy = user._id;
        }
    }

    // parse paginator
    var pagination = utils.parsePaginationOptions(options, 100);

    // parse bounds
    if (options.latBL && options.lngBL && options.latUR && options.lngUR) {
        query.position = { $geoWithin: {
            $box: [
                [parseFloat(options.lngBL), parseFloat(options.latBL)],
                [parseFloat(options.lngUR), parseFloat(options.latUR)]
            ]
        } };
    }

    query = this.find(query);
    query.skip(pagination.skip);
    query.limit(pagination.limit);
    query.sort(sort);

    query.exec(function(err, posts){
        if (err) return callback(err);
        var userIds = _(posts).chain().pluck('_userId').map(String).uniq().value();
        if (userIds && userIds.length) {
            var users = User.find({ _id: { $in: userIds } }, function(err, users){
                if (err) {
                    return callback(err);
                }
                var iUsers = {};

                _.each(users, function(user) {
                    iUsers[user._id] = user;
                });

                callback(null, { posts: posts, users: iUsers });
            });
        } else {
            callback(null, { posts: posts });
        }
    });
};

/**
 * METHODS
 */


/**
 * EXPORTS
 */

var Post = mongoose.model('Post', schema);

module.exports = {
    Post: Post,
    schemas: {
        Post: schema
    }
};
