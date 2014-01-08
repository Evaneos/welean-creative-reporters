/**
 * APPLICATION CONFIGURATION
 * This configuration file will be used by the web app
 * and the workers
 */

// IMPORTS
var nconf         = require('nconf'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    moment        = require('moment'),
    LocalStrategy = require('passport-local').Strategy,
    _             = require('underscore'),
    models        = require(__BACKEND + 'models/'),
    packagejson   = require(__ROOT + 'package.json');

// underscore FTW
global._ = _;
// moment FTW
global.moment = moment;

/**
 * READ THE CONFIGURATION FILE
 */

// read params from CLI and env vars
nconf.argv().env();
// load config file
nconf.file({ file: __ROOT + 'config/config'+(process.env.heroku?'-heroku':'')+'.json' });
nconf.set('version', packagejson.version);
// defaults
nconf.defaults({
    'http': {
        'port': process.env.PORT || 3000
    },
    'mongo': {
        'host': 'localhost',
        'database': 'webzine'
    }
});
// -> STORE GLOBAL CONFIG VARIABLE
global.config = nconf;


/**
 * Add logger globally
 */

global.logger = require('./logger.js')(nconf);


/**
 * CREATE CONNECTION TO MONGO DB
 */

// mongodb://username:password@host:port/database
var mongoStr = 'mongodb://';
if (nconf.get('mongo:username')) mongoStr += '{0}:{1}@'.format(nconf.get('mongo:username'), nconf.get('mongo:password'));
mongoStr += nconf.get('mongo:host');
if (nconf.get('mongo:port')) mongoStr += ':{0}'.format(nconf.get('mongo:port'));
mongoStr += '/{0}'.format(nconf.get('mongo:database'));

// create connection
mongoose.connect(mongoStr);

/**
 * INSTANTIATE EMAIL CLIENT
 */

global.emailServer = require('./email.js')(nconf);


/**
 * PASSPORT CONFIGURATION
 */

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        email = email.toLowerCase();
        models.User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, 1);
            }
            if (user.status != 'validated') {
                return done(null, false, 2);
            }
            if (!user.passwordIsValid(password)) {
                return done(null, false, 3);
            }
            return done(null, user);
        });
    }
));

// Facebook
var facebookConf = nconf.get('facebook');
var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
        clientID: facebookConf.clientId,
        clientSecret: facebookConf.clientSecret,
        callbackURL: "http://" + nconf.get('http').host + "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        var User = models.User;
        var query = {
            'accounts.provider': 'facebook',
            'accounts.facebookId': profile.id
        };
        if (profile.emails) {
            query = {
                $or: [
                    query, {
                        'email': profile.emails.map(function(elt) {
                            return elt.value;
                        })
                    }
                ]
            };
        }
        User.findOne(query, function(err, user) {
            if (!user) {
                user = new User();
            }
            user.name.first = profile.name.givenName;
            user.name.last = profile.name.familyName;
            if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                user.email = profile.emails[0].value;
            }
            if (!user.accounts) {
                user.accounts = [];
            }
            var found = false;
            user.accounts.some(function(account) {
                found = (account.provider === 'facebook' && account.facebookId == profile.id);
                return found;
            });

            if (!found) {
                user.accounts.push({
                    'provider': 'facebook',
                    'facebookId': profile.id
                });
            }

            user.save(function(err, user) {
                return done(err, user);
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    // gets first the user
    models.User.findById(id, function(err, user) {
        done(err, user);
    });
});


/**
 * Exports
 */

module.exports = {
    nconf: nconf,
    mongoose: mongoose,
    passport: passport,
    emailServer: emailServer
};