GLOBAL.__ROOT      = __dirname + '/../';
GLOBAL.__BACKEND   = __dirname + '/../lib/backend/';
GLOBAL.__FRONTEND  = __dirname + '/../lib/frontend/';
GLOBAL.__COMMON    = __dirname + '/../lib/common/';


// EXTERNAL
var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    jadebrowser = require('jade-browser'),
    _           = require('underscore'),
    RedisStore  = require('connect-redis')(express),
    flash       = require('connect-flash'),
    async       = require('async');

// APP DEPS
var config      = require(__BACKEND + 'config/'),
    nconf       = config.nconf,
    models      = require(__BACKEND + 'models/');

module.exports = {
    utils                   : require(__BACKEND + 'utils/'),
    config                  : config,
    nconf                   : nconf,
    models                  : models
};

module.exports.bootstrap = function(callback) {
    var tasks = {};

    // resolve user
    if (nconf.get('user-id')) {
        tasks.user = function(done) {
            models.User.findById(nconf.get('user-id'), done);
        }
    }

    // resolve post
    if (nconf.get('post-id')) {
        tasks.post = function(done) {
            models.Post.findById(nconf.get('post-id'), done);
        }
    }

    async.parallel(tasks, function(err, dependencies) {
        if (err) {
            return callback(err);
        }
        dependencies.nconf = nconf;
        callback(null, dependencies);
    });
};