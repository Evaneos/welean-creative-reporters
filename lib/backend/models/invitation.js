var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var utils         = require(__BACKEND + 'utils');
var async         = require('async');
var moment        = require('moment');

/**
 * SCHEMA
 */

var schema = new Schema({
    name: { type: String },
    _userId: Schema.ObjectId,
    created: { type: Date, 'default': Date.now },
    used: { type: Date },
    _usedBy: Schema.ObjectId
});


/**
 * MIDDLEWARE
 */


/**
 * STATICS
 */


/**
 * METHODS
 */


/**
 * EXPORTS
 */

var Invitation = mongoose.model('Invitation', schema);

module.exports = {
    Invitation: Invitation,
    schemas: {
        Invitation: schema
    }
};
