var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var utils         = require(__BACKEND + 'utils');
var async         = require('async');
var moment        = require('moment');

/**
 * SCHEMA
 */

var schema = new Schema({
    _userId: Schema.ObjectId,
    _postId: Schema.ObjectId,
    created: { type: Date, 'default': Date.now }
});

/**
 * MIDDLEWARE
 */


/**
 * STATICS
 */
schema.statics.existsByUserAndPost = function(userId, postId, callback) {
    this.findOne({ _userId: userId, _postId: postId }).count(function(err, count){
        if (err) {
            return callback(err);
        }
        callback(null, count===1);
    });
};


/**
 * METHODS
 */


/**
 * EXPORTS
 */

var PostStarred = mongoose.model('PostStarred', schema);

module.exports = {
    PostStarred: PostStarred,
    schemas: {
        PostStarred: schema
    }
};
