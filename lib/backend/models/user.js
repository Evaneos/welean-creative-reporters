var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var utils         = require(__BACKEND + 'utils');
var async         = require('async');
var moment        = require('moment');

/**
 * SCHEMA
 */

var schema = new Schema({
    role: { type: String, set: utils.toLower },
    email: { type: String, set: utils.toLower },
    accounts: [{
        provider: String, // (facebook|google|...)
        facebookId: String
    }],
    name: {
        first: String,
        last: String,
        first_i: String,
        last_i: String
    },
    status: {'type': String, 'default': 'validating', 'set': utils.toLower},
    avatar_id: String
});

schema.virtual('name.full').get(function() {
    return this.name.first + ' ' + this.name.last;
});

// make sure the passwords are not outputted there
schema.options.toJSON = {
    transform: function(user, rawUser, options) {
        // raw alteratino here...
    }
};


/**
 * MIDDLEWARE
 */

// make a copy of names as lowercase, just to be
// able to sort them case insentivitively
schema.pre('save', function(next) {
    this.name.first_i = utils.toLower(this.name.first);
    this.name.last_i = utils.toLower(this.name.last);
    next();
});


/**
 * STATICS
 */


/**
 * METHODS
 */


/**
 * EXPORTS
 */

var User = mongoose.model('User', schema);

module.exports = {
    User: User,
    schemas: {
        User: schema
    }
};
